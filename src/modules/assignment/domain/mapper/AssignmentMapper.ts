import type { AssignmentItemDTO } from "@/modules/assignment/domain/dto/AssignmentResponseDTO";
import type { AssignmentEntity } from "@/modules/assignment/domain/entity/AssignmentEntity";

// biome-ignore lint/complexity/noStaticOnlyClass: DDD mapper convention
export class AssignmentMapper {
  static toDTO(entity: AssignmentEntity): AssignmentItemDTO {
    return entity.toJSON();
  }
}
