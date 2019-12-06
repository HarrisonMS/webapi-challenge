const express = require("express")

const Projects = require("../data/helpers/projectModel")
const Actions = require("../data/helpers/actionModel")

const router = express.Router();


const easyErr = (status, message, res) => {
    res.status(status).json({error: message})
}

router.post('/', validateProject, (req, res) => {
    Projects
    .insert(req.body)
    .then(project => {
      res.status(201).json(project)
    })
    .catch(() => {
      easyErr(500, "we couldnt create that project for you buddy", res)
    })
  });
  
router.post('/:id/actions', validateProjectId, validateAction, (req, res) => {
    Actions
    .insert(req.body)
    .then(action => {
      res.status(201).json(action)
    })
    .catch(() => {
      easyErr(500, " couldnt add that new action to the database", res)
    })
});
  
router.get('/', checkRole("admin"), (req, res) => {
    Projects
    .get()
    .then(projects => {
      res.status(200).json(projects);
    })
    .catch(() => {
      easyErr(500, "cant get the Projects from the data base sorry buddy", res)
    }) 
});
  
router.get('/:id',validateProjectId, (req, res) => {
res.status(200).json(req.project);
});
  
router.get('/:id/actions',validateProjectId, (req, res) => {
    Projects
    .getProjectActions(req.project.id)
    .then(action => {
      res.status(200).json(action)
    })
    .catch(() => {
      easyErr(500, "cant get this Projects post from the data base", res)
    })
});
  
router.delete('/:id', validateProjectId, (req, res) => {
	Projects
	.remove(req.params.id)
	.then((count) => {
        if (count > 0) {
            res.status(200).json({ message: 'It has been removed.' });
        } else {
            res.status(400).json({ errorMessage: 'The post with this ID is not found.' });
        }
    })
	.catch((error) => {
        console.log(error);
        res.status(500).json({
            errorMessage : 'Could not be removed.',
        });
    });
});
//   router.delete('/:id', validateprojectId, (req, res) => {
//     Projects.remove(req.params.id)
//     .then(removed => {
//       easyErr(200, "project deleted", res)
//     })
//     .catch(() => {
//       easyErr(500, "i have no clue i cant force this to work something is wrong", res)
//     })
//   });
  
  router.put('/:id', validateProjectId, validateProject, (req, res) => {
    Projects
    .update(req.params.id, req.body)
    .then(post => {
      res.status(200).json(post)
    })
    .catch(() => {
      easyErr(500, "couldn't make those changes to the project", res)
    })
  });

  function checkRole(role) {
    return function(req, res, next) {
      if (role && role === req.headers.role) {
        next();
      }else {
        easyErr(403, "cant touch that you not admin, or an agent", res)
      }
    }
  }
  
  function validateProjectId(req, res, next) {
    const projectId = req.params.id || req.body.project_id;
    Projects
    .get(projectId)
    .then(project => {
      if (project) {
        req.project = project;
      return next()
      } else {
        easyErr(400, "that is not a valid id", res)
      }
    })
    .catch(() => {
      easyErr(500, "cant find that project in our data", res)
    })
  }
  
  function validateProject(req, res, next) {
    if (!Object.entries(req.body).length) {
      easyErr(400, "cant find project data", res)
    } if (!req.body.name) {
      easyErr(400, "name is gunna be required bud", res)
    } if (!req.body.description) {
        easyErr(400, "hey bud we are gunna need a description too", res)
      } else  {
      return next()
    }
  }
  
  function validateAction(req, res, next) {
    if (!Object.entries(req.body).length) {
      easyErr(400, "I can't even find a body bud, one more time please", res)
    }else if (!req.body.description) {
      easyErr(400, "hey buddy ima need a description here ", res)
    }else{
      req.body.project_id = req.project.id;
      next()
    }
  }
  
  module.exports = router;
  