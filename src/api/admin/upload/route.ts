import type { MedusaRequest, MedusaResponse } from "@medusajs/medusa";
import multer from "multer";

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/')
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + '.zip')
    }
});

const upload = multer({ storage: storage });

export async function POST(req: MedusaRequest, res: MedusaResponse) {
    upload.single('file')(req, res, async (error: any) => {
        if (error) {
            return res.status(500).json({ message: 'Ошибка при загрузке файла', error });
        }

        try {
            const productService = req.scope.resolve("productService");
            const product = await productService.create({
                digitalDownloadUrl: req.file.path
            });

            res.status(201).json({ message: 'Файл успешно загружен', product });
        } catch (error) {
            res.status(500).json({ message: 'Ошибка при обработке файла', error });
        }
    });
}
