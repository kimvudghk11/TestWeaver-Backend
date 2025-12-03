class ProjectCreateReq {
    constructor({ userId, name, description, swaggerURL }) {
        this.userId = userId;
        this.name = name;
        this.description = description;
        this.swaggerURL = swaggerURL;
    }
}

class ProjectResp {
    constructor(entity) {
        this.id = entity.id;
        this.name = entity.name;
        this.description = entity.description;
        this.swaggerURL = entity.swagger_url;
        this.createdAt = entity.created_at;
        this.updatedAt = entity.updated_at;
    }
}

module.exports = {
    ProjectCreateReq,
    ProjectResp,
};