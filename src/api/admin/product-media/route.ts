import type {
    MedusaRequest,
    MedusaResponse,
} from "@medusajs/medusa"
import ProductMediaService
    from "../../../services/product-media"
import { MediaType } from "../../../models/product-media"

export const GET = async (
    req: MedusaRequest,
    res: MedusaResponse
) => {
    const productMediaService = req.scope.resolve<
        ProductMediaService
    >("productMediaService")
    // omitting pagination for simplicity
    const [productMedias, count] = await productMediaService
        .listAndCount({
            type: MediaType.MAIN,
        }, {
            relations: ["variant"],
        }
        )

    res.json({
        product_medias: productMedias,
        count,
    })
}

export const POST = async (req: MedusaRequest, res: MedusaResponse) => {
    const { name, file_key, mime_type, variant_id, price, type } = req.body;

    const productMediaService = req.scope.resolve<ProductMediaService>("productMediaService");

    // Создание нового ProductMedia
    try {
        const productMedia = await productMediaService.create({
            name,
            file_key,
            mime_type,
            variant_id,
            price,
            type
        });

        res.json({ product_media: productMedia });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
