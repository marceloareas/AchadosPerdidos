package br.com.cefet.achadosperdidos.domain.enums;



public enum StatusItemEnum {
    MATCHING("MATCHING"),
    EM_DEVOLUCAO("EM_DEVOLUCAO"),
    RECUPERADO("RECUPERADO");

    private final String enumeratedString;

    StatusItemEnum(String  enumeratedString){
        this.enumeratedString=enumeratedString;
    }
    
    public static StatusItemEnum fromString(String enumString){
        for(StatusItemEnum constant: StatusItemEnum.values()){
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
