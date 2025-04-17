import {View, Text, Button} from 'react-native';

export default function Login ({navigation}) {
    return (
        <View >
            <Text>Tela de Login</Text>
            <Button title="Entrar" color={'#f00'} onPress={() => navigation.navigate('MenuDrawer')}/>
        </View>
    )
}