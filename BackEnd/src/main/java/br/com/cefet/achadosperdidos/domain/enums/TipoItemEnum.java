package br.com.cefet.achadosperdidos.domain.enums;

import lombok.Getter;

@Getter
public enum TipoItemEnum {
    PERDIDO("PERDIDO"),
    ACHADO("ACHADO");

    private final String enumeratedString;

    TipoItemEnum(String  enumeratedString){
        this.enumeratedString=enumeratedString;
    }
    
    public static TipoItemEnum fromString(String enumString){
        for(TipoItemEnum constant: TipoItemEnum.values()){
            if(enumString.equalsIgnoreCase(constant.getEnumeratedString())){
                return constant;
            }
        }
        throw new EnumConstantNotPresentException(StatusItemEnum.class, enumString);

        // Lançar exceção customizada
    }

}
