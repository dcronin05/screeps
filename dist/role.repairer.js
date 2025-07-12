var roleRepairer = {

    /** @param {Creep} creep **/
    run: function(creep) {

        creep.say("🔧");
        
		if(creep.memory.repairing && creep.store[RESOURCE_ENERGY] == 0) {
			creep.memory.repairing = false;
	    }
	    if(!creep.memory.repairing && creep.store.getFreeCapacity() == 0) {
			creep.memory.repairing = true;
	    }
		
	    if(creep.memory.repairing) {
			var targets = creep.room.find(
				FIND_STRUCTURES, { 
					filter: (structure) => { 
						return (structure.hits < 500000 && structure.hits < structure.hitsMax)  ||
                		(structure.structureType == STRUCTURE_CONTAINER && structure.hits < structure.hitsMax)
					}
				}
			);

			// if(Game.time % 2 == 0 && targets.length > 0) {
			// 	console.log("Repairing " + targets[0].structureType + " with ID: " + targets[0].id + " with hits: " + targets[0].hits + " out of " + targets[0].hitsMax);
			// };

			if(targets.length > 0) {
				var target = creep.pos.findClosestByRange(targets);
				if(creep.repair(target) == ERR_NOT_IN_RANGE) {
					creep.moveTo(target, {visualizePathStyle: {stroke: '#7DDA58'}});
				}
			}
			// else {
			// 	var targets = creep.room.find(FIND_CONSTRUCTION_SITES);
            // 	if(targets.length && targets[0].structureType != "container") {
            //     	if(creep.build(targets[0]) == ERR_NOT_IN_RANGE) {
            //         	creep.moveTo(targets[0], {visualizePathStyle: {stroke: '#FE9900'}});
			// 		}
          	// 	}
			// }
	    }
	    else {
            var energy_stores = creep.room.find(FIND_STRUCTURES, {
                filter: (structure) => {
                    return (structure.structureType == STRUCTURE_STORAGE)
                }
            });
            if (energy_stores.length > 0) {
                for (var store of energy_stores) {
                    if (store.store[RESOURCE_ENERGY] > 0) {
                        if (creep.withdraw(store, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                            creep.moveTo(store, {visualizePathStyle: {stroke: '#FFDE59'}});
                        }
                    }
                }
            }
	    }
	}
};

module.exports = roleRepairer;