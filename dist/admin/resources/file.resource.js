import uploadFileFeature from "@adminjs/upload";
import path from "path";
import { File } from "../../entities/file.entity.js";
import { componentLoader } from "../components.bundler.js";
const getFileResource = (orm) => ({
    resource: { model: File, orm },
    options: {
        navigation: { name: "Sasd asd asdasdDfjsdnfsdj", icon: "asd" },
        properties: {
            id: { isVisible: false },
            name: { isTitle: true },
            path: {
                isVisible: { list: false, filter: false, show: true, edit: true },
            },
            mimetype: {},
            size: {},
            createdAt: {
                isVisible: { edit: false, show: true, list: true, filter: true },
            },
        },
    },
    features: [
        uploadFileFeature({
            provider: {
                local: {
                    bucket: path.join(process.cwd(), "uploads"),
                    opts: {
                        baseUrl: "/uploads",
                    },
                },
            },
            componentLoader,
            properties: {
                key: "path",
                mimeType: "mimetype",
                size: "size",
                filename: "name",
                file: "uploadFile",
            },
            uploadPath: (record, filename) => `photos/${Date.now()}-${filename}`,
        }),
    ],
});
export default getFileResource;
