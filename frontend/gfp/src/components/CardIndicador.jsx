const CardIndicador = ({ titulo, valor, cor, icone }) => {
    return (
        <div className="bg-white p-6 rounded-lg shadow-md border-l-4"  
                style={{ borderColor: cor }}>
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-gray-600 text-sm font-medium mb-1">{titulo}</p>
                    <p className="text-2xl font-bold" style={{color: cor}}>{valor}</p>
                </div> 
                {/* Icone */}
                <div className="p-3 rounded-full bg-gray-200" style={{color: cor}}>
                    {icone}
                </div>
            </div>
        </div>
    )    
}

export default CardIndicador