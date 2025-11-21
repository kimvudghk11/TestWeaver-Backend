class ProjectCreateReq {
    constructor({ name, description }) {
        this.name = name;
        this.description = description;
    }
}

class ProjectResp {
    constructor(entity) {
        this.id = entity.id;
        this.name = entity.name;
        this.description = entity.description;
        this.createdAt = entity.created_at;
        this.updatedAt = entity.updated_at;
    }
}

module.exports = {
    ProjectCreateReq,
    ProjectResp,
};