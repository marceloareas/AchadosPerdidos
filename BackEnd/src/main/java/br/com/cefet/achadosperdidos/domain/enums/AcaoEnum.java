package br.com.cefet.achadosperdidos.domain.enums;
 

public enum AcaoEnum {
    SOLICITACAO_ENTREGA("SOLICITACAO_ENTREGA"),
    SOLICITACAO_FINALIZACAO("SOLICITACAO_FINALIZACAO");

    private final String enumeratedString;

    AcaoEnum(String  enumeratedString){
        this.enumeratedString=enumeratedString;
    }
    
    public static AcaoEnum fromString(String enumString){
        for(AcaoEnum constant: AcaoEnum.values()){
            if(enumString.equalsIgnoreCase(constant.getEnumeratedString())){
                return constant;
            }
        }
        throw new EnumConstantNotPresentException(StatusItemEnum.class, enumString);

        // Lançar exceção customizada
    }

    public String getEnumeratedString(){
        return enumeratedString;
    }
}
