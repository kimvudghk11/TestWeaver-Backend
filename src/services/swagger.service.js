// src/services/swagger.service.js
const SwaggerParser = require("@apidevtools/swagger-parser");

/**
 * Swagger URL을 분석해서 API 목록을 반환합니다.
 */
async function parseSwagger(url) {
    try {
        // 1. URL에서 Swagger JSON을 가져와서 유효성 검사 및 파싱
        const api = await SwaggerParser.parse(url);
        console.log(`Swagger Title: ${api.info.title}`);

        const endpoints = [];

        // 2. Paths(API 주소) 순회
        for (const [path, methods] of Object.entries(api.paths)) {
            // 3. Methods(GET, POST 등) 순회
            for (const [method, operation] of Object.entries(methods)) {

                // 파라미터 추출 (Query, Path, Body 등)
                const parameters = [];

                // (1) 기본 파라미터 (Query, Path)
                if (operation.parameters) {
                    operation.parameters.forEach(p => {
                        parameters.push({
                            name: p.name,
                            in: p.in, // query, path, header
                            required: p.required || false,
                            type: p.schema?.type || "string"
                        });
                    });
                }

                // (2) Request Body (POST/PUT 데이터)
                if (operation.requestBody) {
                    const content = operation.requestBody.content;
                    // application/json이 있는 경우만 처리
                    if (content && content["application/json"]) {
                        const schema = content["application/json"].schema;

                        // 스키마 안에 있는 속성들 추출
                        if (schema.properties) {
                            for (const [propName, propSchema] of Object.entries(schema.properties)) {
                                parameters.push({
                                    name: propName,
                                    in: "body",
                                    required: schema.required?.includes(propName) || false,
                                    type: propSchema.type,
                                    format: propSchema.format // email, password 등 확인용
                                });
                            }
                        }
                    }
                }

                endpoints.push({
                    path,
                    method: method.toUpperCase(),
                    summary: operation.summary || "",
                    parameters
                });
            }
        }

        return {
            title: api.info.title,
            version: api.info.version,
            endpoints
        };

    } catch (error) {
        console.error("Swagger Parse Error:", error.message);
        throw new Error("Swagger 문서를 불러오는 데 실패했습니다. URL을 확인해주세요.");
    }
}

module.exports = { parseSwagger };