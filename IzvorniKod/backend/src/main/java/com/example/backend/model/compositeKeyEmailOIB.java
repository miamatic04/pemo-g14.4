package com.example.backend.model;

import java.io.Serializable;

public class compositeKeyEmailOIB implements Serializable {

    private String email;    // primarni ključ iz Person
    private String OIB;      // OIB vlasnika

    public compositeKeyEmailOIB() {

    }

    public compositeKeyEmailOIB(String email, String OIB) {
        this.email = email;
        this.OIB = OIB;
    }

    // getteri i setteri
    public String getEmail() {
        return email;
    }

    public void setId(String id) {
        this.email = id;
    }

    public String getOIB() {
        return OIB;
    }

    public void setOIB(String OIB) {
        this.OIB = OIB;
    }

    // jedinstvenost kompozitnog ključa se osigurava preko equals() i hashCode()
    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;

        compositeKeyEmailOIB osobaId = (compositeKeyEmailOIB) o;

        if (!email.equals(osobaId.email)) return false;
        return OIB.equals(osobaId.OIB);
    }

    @Override
    public int hashCode() {
        int result = email.hashCode();
        result = 31 * result + OIB.hashCode();
        return result;
    }
}
