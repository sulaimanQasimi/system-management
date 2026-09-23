import { Moon, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from '@/components/ui/tooltip';
import { useAppearance } from '@/hooks/use-appearance';
import { useTranslations } from '@/hooks/use-locale';

/**
 * Compact light/dark toggle for the app header.
 * Switches based on the currently resolved theme so system mode
 * still flips to an explicit opposite preference on click.
 */
export function ThemeToggle() {
    const { resolvedAppearance, updateAppearance } = useAppearance();
    const { t } = useTranslations();
    const isDark = resolvedAppearance === 'dark';

    return (
        <Tooltip>
            <TooltipTrigger asChild>
                <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="size-8 shrink-0"
                    aria-label={
                        isDark ? t('theme.switchToLight') : t('theme.switchToDark')
                    }
                    onClick={() =>
                        updateAppearance(isDark ? 'light' : 'dark')
                    }
                >
                    {isDark ? (
                        <Sun className="size-4" aria-hidden />
                    ) : (
                        <Moon className="size-4" aria-hidden />
                    )}
                </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom">
                {isDark ? t('theme.lightMode') : t('theme.darkMode')}
            </TooltipContent>
        </Tooltip>
    );
}
