package pe.edu.vallegrande.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import pe.edu.vallegrande.model.CicloModel;
import pe.edu.vallegrande.repository.CicloRepository;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.time.LocalDate;

@Service
public class CicloService {

    private final CicloRepository cicloRepository;

    @Autowired
    public CicloService(CicloRepository cicloRepository) {
        this.cicloRepository = cicloRepository;
    }

    // Obtener todos los ciclos mendiante la vista
    public Flux<CicloModel> getAllCycleLifeData() {
        return cicloRepository.findAllFromVista(); // Usar la vista
    }

    // Obtener todos los ciclos
    public Flux<CicloModel> getAllCiclos() {
        return cicloRepository.findAll();
    }

    // Obtener un ciclo por ID
    public Mono<CicloModel> getCicloById(Long id) {
        return cicloRepository.findById(id);
    }

    // Obtener ciclos por tipo de alimentación o vacunación
    public Flux<CicloModel> getCiclosByTypeIto(String typeIto) {
        return cicloRepository.findByTypeIto(typeIto);
    }

    // Obtener ciclos activos
    public Flux<CicloModel> getActiveCiclos() {
        return cicloRepository.findByStatus("A");
    }

    // Obtener ciclos inactivos
    public Flux<CicloModel> getInactiveCiclos() {
        return cicloRepository.findByStatus("I");
    }

    // Crear un nuevo ciclo
    public Mono<CicloModel> createCiclo(CicloModel ciclo) {
        return cicloRepository.save(ciclo);
    }

    // Actualizar un ciclo existente
    public Mono<CicloModel> updateCiclo(Long id, CicloModel ciclo) {
        return cicloRepository.findById(id)
                .flatMap(existingCiclo -> {
                    existingCiclo.setHenId(ciclo.getHenId());
                    existingCiclo.setTypeIto(ciclo.getTypeIto());
                    existingCiclo.setNameIto(ciclo.getNameIto());
                    existingCiclo.setTypeTime(ciclo.getTypeTime());
                    existingCiclo.setTimes(ciclo.getTimes());
                    existingCiclo.setStatus(ciclo.getStatus());
                    return cicloRepository.save(existingCiclo);
                });
    }

    // Eliminar un ciclo físicamente por ID
    public Mono<Void> deleteCiclo(Long id) {
        return cicloRepository.deleteById(id);
    }

    // Inactivar un ciclo por ID (eliminación lógica)
public Mono<CicloModel> deactivateCiclo(Long id) {
    return cicloRepository.findById(id) // Buscar el ciclo por ID
            .flatMap(ciclo -> {
                ciclo.setStatus("I"); // Cambiar estado a inactivo
                return cicloRepository.save(ciclo); // Guardar cambios
            });
}

    // Activar un ciclo por ID
    public Mono<CicloModel> activateCiclo(Long id) {
        return cicloRepository.findById(id)
                .flatMap(ciclo -> {
                    ciclo.setStatus("A");
                    return cicloRepository.save(ciclo);
                });
    }
}
