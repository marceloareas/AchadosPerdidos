package br.com.cefet.achadosperdidos.domain.enums;


import lombok.Getter;

@Getter
public enum TipoEventoMudancaStatus {
    EM_DEVOLUCAO("EM_DEVOLUCAO"),
    DEVOLVIDO("DEVOLVIDO");

    private final String enumeratedString;

    TipoEventoMudancaStatus(String  enumeratedString){
        this.enumeratedString=enumeratedString;
    }
    
    public static TipoEventoMudancaStatus fromString(String enumString){
        for(TipoEventoMudancaStatus constant: TipoEventoMudancaStatus.values()){
            if(enumString.equalsIgnoreCase(constant.getEnumeratedString())){
                return constant;
            }
        }
        throw new EnumConstantNotPresentException(TipoEventoMudancaStatus.class, enumString);

    }

}
