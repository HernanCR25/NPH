package pe.edu.vallegrande.repository;

import org.springframework.data.repository.reactive.ReactiveCrudRepository;
import org.springframework.stereotype.Repository;
import pe.edu.vallegrande.model.CicloModel;
import reactor.core.publisher.Flux;

@Repository
public interface CicloRepository extends ReactiveCrudRepository<CicloModel, Long> {

    // Buscar ciclos por tipo de alimentación o vacunación
    Flux<CicloModel> findByTypeIto(String typeIto);

    // Buscar ciclos por su estado (activo o inactivo)
    Flux<CicloModel> findByStatus(String status);
}

