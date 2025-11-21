const ProjectRepo = require("../repositories/project.repository");
const { ProjectCreateReq, ProjectResp } = require("../dto/project.dto");

async function create(reqBody) {
    const dto = new ProjectCreateReq(reqBody);
    const entity = await ProjectRepo.createProject(dto);

    return new ProjectResp(entity);
}

async function list(query) {
    const rows = query
        ? await ProjectRepo.searchByName(query)
        : await ProjectRepo.findAll()

    return rows.map(row => new ProjectResp(row));
}

async function detail(id) {
    const entity = await ProjectRepo.findById(id);

    if (!entity) {
        const err = new Error("Project not found");
        err.status = 404;

        throw err;
    }

    return new ProjectResp(entity);
}

async function update(id, body) {
    const entity = await ProjectRepo.updateProject(id, body);

    return new ProjectResp(entity);
}

async function remove(id) {
    await ProjectRepo.deleteProject(id);

    return { success: true };
}

module.exports = {
    create,
    list,
    detail,
    update,
    remove,
};