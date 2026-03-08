import '../css/app.css';
import './bootstrap';

import { ThemeProvider } from '@/Contexts/ThemeContext';
import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { createRoot, hydrateRoot } from 'react-dom/client';

const appName = import.meta.env.VITE_APP_NAME || 'Laravel';

createInertiaApp({
    title: (title) => `${title} - ${appName}`,
    resolve: (name) =>
        resolvePageComponent(
            `./Pages/${name}.tsx`,
            import.meta.glob('./Pages/**/*.tsx'),
        ),
    setup({ el, App, props }) {
        const app = (
            <ThemeProvider>
                <App {...props} />
            </ThemeProvider>
        );
        if (import.meta.env.SSR) {
            hydrateRoot(el, app);
            return;
        }
        createRoot(el).render(app);
    },
    progress: {
        color: '#10B981',
    },
});
