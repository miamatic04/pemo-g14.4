package com.example.backend.model;

import jakarta.persistence.Embeddable;
import lombok.*;

import java.io.Serializable;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Embeddable
@EqualsAndHashCode
public class compositeKeyEmailOIB implements Serializable {

    private String email;    // primarni ključ iz Person
    private String OIB;      // OIB vlasnika

/*
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
 */
}
