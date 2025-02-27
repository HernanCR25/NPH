package pe.edu.vallegrande.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import pe.edu.vallegrande.model.CicloModel;
import pe.edu.vallegrande.repository.CicloRepository;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

@Service
public class CicloService {

    private final CicloRepository cicloRepository;

    @Autowired
    public CicloService(CicloRepository cicloRepository) {
        this.cicloRepository = cicloRepository;
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
        return cicloRepository.findByStatus("A"); // Filtra por status "A" (Activo)
    }

    // Obtener ciclos inactivos
    public Flux<CicloModel> getInactiveCiclos() {
        return cicloRepository.findByStatus("I"); // Filtra por status "I" (Inactivo)
    }

    // Crear un nuevo ciclo
    public Mono<CicloModel> createCiclo(CicloModel ciclo) {
        return cicloRepository.save(ciclo);
    }

    // Actualizar un ciclo existente
    public Mono<CicloModel> updateCiclo(Long id, CicloModel ciclo) {
        return cicloRepository.findById(id)
                .flatMap(existingCiclo -> {
                    existingCiclo.setTypeIto(ciclo.getTypeIto());
                    existingCiclo.setNameIto(ciclo.getNameIto());
                    existingCiclo.setTypeTime(ciclo.getTypeTime());
                    existingCiclo.setTimes(ciclo.getTimes());
                    return cicloRepository.save(existingCiclo);
                });
    }

    // Eliminar un ciclo físicamente por ID
    public Mono<Void> deleteCiclo(Long id) {
        return cicloRepository.deleteById(id);
    }

    // Inactivar un ciclo por ID (eliminación lógica)
    public Mono<CicloModel> deactivateCiclo(Long id) {
        return cicloRepository.findById(id)
                .flatMap(ciclo -> {
                    ciclo.setStatus("I"); // Cambia el estado a "Inactivo"
                    return cicloRepository.save(ciclo);
                });
    }

    // Activar un ciclo por ID
    public Mono<CicloModel> activateCiclo(Long id) {
        return cicloRepository.findById(id)
                .flatMap(ciclo -> {
                    ciclo.setStatus("A"); // Cambia el estado a "Activo"
                    return cicloRepository.save(ciclo);
                });
    }
}