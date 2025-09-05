import { Md4K, MdDirectionsCar, MdFavorite, MdFitnessCenter, MdHome, MdPets, MdRestaurant, MdSchool, MdShoppingCart, MdSportsSoccer, MdWallet } from "react-icons/md";

export const enderecoServidor = 'http://localhost:3000'

export const listaCores = ['#FF5733', '#FFC300', '#DAF7A6', '#33FF57', '#33A1FF', '#8D33FF', '#FF33EC', '#FF33A1', '#33FFF6', '#FF7F50'];
export const listaIcones = ['restaurant', 'directions-car', 'school', 'home', 'sports-soccer', 
    'shopping-cart', 'pets', 'favorite', 'fitness-center', 'wallet', '4k'];

export const iconesCategoria = {
        'restaurant': <MdRestaurant className="w-6 h-6" />,
        'directions-car': <MdDirectionsCar className="w-6 h-6" />,
        'school': <MdSchool className="w-6 h-6" />,
        'home': <MdHome className="w-6 h-6" />,
        'sports-soccer': <MdSportsSoccer className="w-6 h-6" />,
        'shopping-cart': <MdShoppingCart className="w-6 h-6" />,
        'pets': <MdPets className="w-6 h-6" />,
        'favorite': <MdFavorite className="w-6 h-6" />,
        'fitness-center': <MdFitnessCenter className="w-6 h-6" />,
        'wallet': <MdWallet className="w-6 h-6" />,
        '4k': <Md4K className="w-6 h-6" />,
    }