package pe.edu.vallegrande.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.relational.core.mapping.Column;
import org.springframework.data.relational.core.mapping.Table;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Table("cycle_life")
public class CicloModel {

    @Id
    private Long id;

    @Column("type_ito")
    private String typeIto;

    @Column("name_ito")
    private String nameIto;

    @Column("type_time")
    private String typeTime;

    @Column("times")
    private String times;

    @Column("status")
    private String status;
}


