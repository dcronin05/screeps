var roleRepairer = {

    /** @param {Creep} creep **/
    run: function(creep) {

	    if(creep.memory.repairing && creep.store[RESOURCE_ENERGY] == 0) {
            creep.memory.repairing = false;
	    }
	    if(!creep.memory.repairing && creep.store.getFreeCapacity() == 0) {
	        creep.memory.repairing = true;
	    }

	    if(creep.memory.repairing) {
	        var targets = creep.room.find(FIND_STRUCTURES);
			targets.sort((b,a) => (a.hitsMax / a.hits) - (b.hitsMax / b.hits));
			if(Game.time % 2 == 0 && targets.length > 0) {
				console.log("Repairing " + targets[0].structureType + " with ID: " + targets[0].id + " with hits: " + targets[0].hits + " out of " + targets[0].hitsMax);
			};
			if(targets.length > 0) {
				if(creep.repair(targets[0]) == ERR_NOT_IN_RANGE) {
					creep.moveTo(targets[0], {visualizePathStyle: {stroke: '#7DDA58'}});
									}
			}
			else {
				var targets = creep.room.find(FIND_CONSTRUCTION_SITES);
            	if(targets.length && targets[0].structureType != "container") {
                	if(creep.build(targets[0]) == ERR_NOT_IN_RANGE) {
                    	creep.moveTo(targets[0], {visualizePathStyle: {stroke: '#FE9900'}});
						                	}
          		}
			}
	    }
	    else {
	        var sources = creep.room.find(FIND_SOURCES);
            if(creep.harvest(sources[1]) == ERR_NOT_IN_RANGE) {
                creep.moveTo(sources[1], {visualizePathStyle: {stroke: '#FFDE59'}});
				            }
	    }
	}
};

module.exports = roleRepairer;