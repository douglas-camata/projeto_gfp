import { StyleSheet } from 'react-native';
import { corPrincipal, corSecundaria, corFundo, corFundo2, corTextos, corTextos2, corPreto } from './Estilos';

const Estilos = StyleSheet.create({
    container: {
        flex: 1,
    },
    gradientBackground: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 20,
    },
    header: {
        width: '100%',
        alignItems: 'center',
        marginBottom: 30,
    },
    logoContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    logoText: {
        fontSize: 28,
        fontWeight: 'bold',
        color: corTextos,
        marginLeft: 5,
    },
    headerSubTitle: {
        color: 'rgba(255, 255, 255, 0.8)',
        fontSize: 16,
        textAlign: 'center',
        flexDirection: 'column',
        marginLeft: 5,
    },
    loginCard: {
        width: '100%',
        backgroundColor: corTextos,
        borderRadius: 24,
        padding: 24,
        shadowColor: corPreto,
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 5,
        marginBottom: 20,
    },
    loginTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: corPreto,
        marginBottom: 20,
        textAlign: 'center'
    },
    
    forgotPasswordContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
    },
    forgotPasswordText: {
        color: corPrincipal,
        fontSize: 14,
    },
    signUpContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    signUpText: {
        color: corTextos2,
        fontSize: 14,
    },
    signUpLink: {
        color: corPrincipal,
        fontSize: 14,
        fontWeight: 'bold',
    },
    featuresContainer: {
        width: '100%',
        marginBottom: 20,
    },
    featureItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 15,
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        padding: 15,
        borderRadius: 12,
    },
    featureText: {
        color: corTextos,
        marginLeft: 10,
        fontSize: 14,
    },
});

export default Estilos;