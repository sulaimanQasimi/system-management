<?php

use App\Models\ActiveDirectoryUser;
use App\Models\Department;
use App\Models\User;
use App\Support\AppPermissions;
use Illuminate\Http\UploadedFile;
use Maatwebsite\Excel\Facades\Excel;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

beforeEach(function () {
    $this->admin = User::factory()->create();
    $role = Role::findOrCreate(AppPermissions::ROLE_SUPER_ADMIN);

    foreach (AppPermissions::all() as $permission) {
        Permission::findOrCreate($permission);
    }

    $role->syncPermissions(Permission::query()->whereIn('name', AppPermissions::all())->get());
    $this->admin->assignRole($role);
});

test('authorized users can export ad users to excel', function () {
    Excel::fake();
    Excel::matchByRegex();

    $department = Department::query()->create(['name' => 'IT']);
    ActiveDirectoryUser::query()->create([
        'name' => 'Ada',
        'lastname' => 'Lovelace',
        'username' => 'ada.lovelace',
        'email' => 'ada.lovelace@mov.gov.af',
        'department_id' => $department->id,
        'job' => 'Engineer',
        'created_by' => $this->admin->id,
        'date' => now()->toDateString(),
    ]);

    $this->actingAs($this->admin)
        ->get(route('ad-users.export'))
        ->assertOk();

    Excel::assertDownloaded('/ad-users-\d{4}-\d{2}-\d{2}-\d{6}\.xlsx/');
});

test('authorized users can download import template', function () {
    Excel::fake();

    $this->actingAs($this->admin)
        ->get(route('ad-users.import.template'))
        ->assertOk();

    Excel::assertDownloaded('ad-users-import-template.xlsx');
});

test('authorized users can import ad users from csv', function () {
    $department = Department::query()->create(['name' => 'Network']);

    $csv = implode("\n", [
        'name,lastname,username,department,job,pbx,phone,date',
        'Grace,Hopper,grace.hopper,Network,Admiral,100,0700000000,'.now()->toDateString(),
    ]);

    $file = UploadedFile::fake()->createWithContent('ad-users.csv', $csv);

    $this->actingAs($this->admin)
        ->post(route('ad-users.import'), ['file' => $file])
        ->assertRedirect(route('ad-users.index'))
        ->assertSessionHasNoErrors();

    $this->assertDatabaseHas('active_directory_users', [
        'username' => 'grace.hopper',
        'email' => 'grace.hopper@mov.gov.af',
        'name' => 'Grace',
        'lastname' => 'Hopper',
        'department_id' => $department->id,
        'job' => 'Admiral',
        'created_by' => $this->admin->id,
    ]);
});

test('import updates existing users by username', function () {
    $department = Department::query()->create(['name' => 'Network']);

    ActiveDirectoryUser::query()->create([
        'name' => 'Old',
        'lastname' => 'Name',
        'username' => 'grace.hopper',
        'email' => 'grace.hopper@mov.gov.af',
        'department_id' => null,
        'job' => 'Cadet',
        'created_by' => $this->admin->id,
        'date' => now()->toDateString(),
    ]);

    $csv = implode("\n", [
        'name,lastname,username,department,job,pbx,phone,date',
        'Grace,Hopper,grace.hopper,Network,Admiral,100,0700000000,'.now()->toDateString(),
    ]);

    $file = UploadedFile::fake()->createWithContent('ad-users.csv', $csv);

    $this->actingAs($this->admin)
        ->post(route('ad-users.import'), ['file' => $file])
        ->assertRedirect(route('ad-users.index'));

    expect(ActiveDirectoryUser::query()->where('username', 'grace.hopper')->count())->toBe(1);

    $this->assertDatabaseHas('active_directory_users', [
        'username' => 'grace.hopper',
        'name' => 'Grace',
        'lastname' => 'Hopper',
        'job' => 'Admiral',
        'department_id' => $department->id,
        'created_by' => $this->admin->id,
    ]);
});
