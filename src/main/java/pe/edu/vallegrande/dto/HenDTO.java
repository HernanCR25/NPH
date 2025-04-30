package pe.edu.vallegrande.dto;

public class HenDTO {
    private Long henId;  // Campo para el ID de la gallina

    // Getter y Setter para henId
    public Long getHenId() {
        return henId;
    }

    public void setHenId(Long henId) {
        this.henId = henId;
    }

    // Método toString para depuración
    @Override
    public String toString() {
        return "HenDTO{" +
               "henId=" + henId +
               '}';
    }
}
