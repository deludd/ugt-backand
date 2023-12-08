import {
    type SubscriberConfig,
    type SubscriberArgs,
    OrderService,
    AbstractFileService,
} from "@medusajs/medusa"

export default async function handleOrderPlaced({
    data, eventName, container, pluginOptions,
}: SubscriberArgs<Record<string, string>>) {
    const orderService: OrderService = container.resolve(
        "orderService"
    )
    const fileService: AbstractFileService = container.resolve(
        "fileService"
    )
    const sendgridService = container.resolve("sendgridService")

    const order = await orderService.retrieve(data.id, {
        relations: [
            "items",
            "items.variant",
            "items.variant.product_media",
        ],
    })

    // find product medias in the order
    const urls = []
    for (const item of order.items) {
        if (!item.variant.product_media.length) {
            return
        }

        await Promise.all([
            item.variant.product_media.forEach(
                async (productMedia) => {
                    // get the download URL from the file service
                    const downloadUrl = await
                        fileService.getPresignedDownloadUrl({
                            fileKey: productMedia.file_key,
                            isPrivate: true,
                        })

                    urls.push(downloadUrl)
                }),
        ])
    }

    if (!urls.length) {
        return
    }

    sendgridService.sendEmail({
        templateId: "digital-download",
        from: "hello@medusajs.com",
        to: order.email,
        dynamic_template_data: {
            // any data necessary for your template...
            digital_download_urls: urls,
        },
    })
}

export const config: SubscriberConfig = {
    event: OrderService.Events.PLACED,
    context: {
        subscriberId: "order-placed-handler",
    },
}