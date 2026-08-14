package cz.zakharchenkoartem.examo_be.models;

public class Views {
    // What the student is allowed to see
    public interface Student {
    }

    // Admin inherits everything from Student, PLUS admin-only fields
    public interface Admin extends Student {
    }
}
