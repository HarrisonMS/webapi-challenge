const express = require("express")

const Actions = require("../data/helpers/actionModel")

const router = express.Router();


const easyErr = (status, message, res) => {
    res.status(status).json({error: message})
}
router.post('/', validateAction, (req, res) => {
	const { project_id, description, notes } = req.body;
	if (!project_id || !description || !notes) {
        easyErr(400, "please provide project_id, description and notes for this action post")
	} else {
		Actions
			.insert({ project_id, description, notes })
			.then(({ id }) => {
				Actions.get(id).then((actionPost) => {
					res.status(201).json(actionPost);
				});
			})
			.catch((error) => {
                console.log(error);
                easyErr(500, "There was an error while saving the post to the database",res)
			});
	}
});
// router.post('/', validateProject, (req, res) => {
//     Actions
//     .insert(req.body)
//     .then(project => {
//       res.status(201).json(project)
//     })
//     .catch(() => {
//       easyErr(500, "we couldnt create that project for you buddy", res)
//     })
//   });
  
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
    Actions
    .get()
    .then(Actions => {
      res.status(200).json(Actions);
    })
    .catch(() => {
      easyErr(500, "cant get the Actions from the data base sorry buddy", res)
    }) 
});
  
router.get('/:id',validateProjectId, (req, res) => {
res.status(200).json(req.project);
});
  
router.get('/:id/actions',validateProjectId, (req, res) => {
    Actions
    .getProjectActions(req.project.id)
    .then(action => {
      res.status(200).json(action)
    })
    .catch(() => {
      easyErr(500, "cant get this Actions post from the data base", res)
    })
});
  
router.delete('/:id', validateProjectId, (req, res) => {
	Actions
	.remove(req.params.id)
	.then((count) => {
        if (count > 0) {
            easyErr(200, "you removed the acion")
        } else {
            easyErr(200, "the post with this id isn't in our database")
        }
    })
	.catch((error) => {
        console.log(error);
        easyErr(500, "couldn't remove that", res)
        res.status(500).json({
            errorMessage : 'Could not be removed.',
        });
    });
});
//   router.delete('/:id', validateprojectId, (req, res) => {
//     Actions.remove(req.params.id)
//     .then(removed => {
//       easyErr(200, "project deleted", res)
//     })
//     .catch(() => {
//       easyErr(500, "i have no clue i cant force this to work something is wrong", res)
//     })
//   });
  
  router.put('/:id', validateProjectId, validateProject, (req, res) => {
    Actions
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
    Actions
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
    // const {name} = req.body
    
  //   if (!req.body) {
  //     easyErr(400, "missing project data", res)
  //   } else if (!req.body.name){
  //     easyErr(400, "missing required", res)
  //   } else {
  //     return next()
  //   }
  // }
  
    if (!Object.entries(req.body).length) {
      easyErr(400, "cant find project data", res)
    } if (!req.body.notes) {
      easyErr(400, "notes is gunna be required bud", res)
    } if (!req.body.description) {
        easyErr(400, "hey bud we are gunna need a description too", res)
      } else  {
      return next()
    }
  }




  function validateAction(req, res, next) {
	if (!Object.entries(req.body).length) {
		res.status(404).json({ message: 'missing project' });
	}
	if (!req.body.project_id) {
		res.status(404).json({ message: 'missing project_id' });
	}
	if (!req.body.description) {
		res.status(404).json({ message: 'missing description' });
	}
	if (!req.body.notes) {
		res.status(404).json({ message: 'missing notes' });
	}
	if (req.body.description && req.body.description.length > 128) {
		res.status(400).json({ error: 'description limit is 128' });
	} else {
		return next();
	}
}


  
//   function validateAction(req, res, next) {
//     if (!req.body) {
//       easyErr(400, "can't find action data", res)
//     }else if (!req.body.description) {
//       easyErr(400, "decribe your action please ", res)
//     }else{
//       req.body.project_id = req.project.id;
//       next()
//     }
//   }
  
  module.exports = router;
  