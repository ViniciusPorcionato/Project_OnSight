import { UserProvider } from '@/providers/userContext';
import '../src/app/globals.css';

function MyApp({ Component, pageProps }) {
    return (
        <UserProvider>
            <Component {...pageProps} />
        </UserProvider>
    );
}

export default MyApp;
