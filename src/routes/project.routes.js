const express = require("express");
const router = express.Router();

const projectCtrl = require("../controllers/project.controller");

router.post("/", projectCtrl.create);
router.get("/", projectCtrl.list);
router.get("/:id", projectCtrl.detail);
router.put("/:id", projectCtrl.update);
router.delete("/:id", projectCtrl.remove);

router.post("/:id/model", projectCtrl.generateModel);
router.get("/:id/testcases", projectCtrl.getTestCases);

module.exports = router;