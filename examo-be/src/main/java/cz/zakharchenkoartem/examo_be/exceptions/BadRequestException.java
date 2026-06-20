package cz.zakharchenkoartem.examo_be.exceptions;

public class BadRequestException extends RuntimeException {
    public BadRequestException(String message) {
        super(message);
    }    
}
