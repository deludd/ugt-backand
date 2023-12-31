import {
    BeforeInsert,
    Column,
    Entity,
    ManyToOne,
    JoinColumn
} from "typeorm";
import { BaseEntity, ProductVariant } from "@medusajs/medusa";
import { generateEntityId } from "@medusajs/medusa/dist/utils";

export enum MediaType {
    MAIN = "main",
    PREVIEW = "preview"
}

@Entity()
export class ProductMedia extends BaseEntity {
    @Column({ type: "varchar" })
    name: string;

    @Column({ type: "enum", enum: MediaType, default: MediaType.MAIN })
    type: MediaType;

    @Column({ type: "int" })
    price: number;

    @Column({ type: "varchar" })
    file_key: string;

    @Column({ type: "varchar" })
    mime_type: string;

    @Column({ type: "varchar" })
    variant_id: string;

    @ManyToOne(() => ProductVariant)
    @JoinColumn({ name: "variant_id" })
    variant: ProductVariant;

    @BeforeInsert()
    private beforeInsert(): void {
        this.id = generateEntityId(this.id, "prodMedia");
    }
}
