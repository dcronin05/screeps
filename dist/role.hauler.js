var roleHauler = {

    /** @param {Creep} creep **/
    run: function(creep) {

	    if(creep.memory.hauling && creep.store[RESOURCE_ENERGY] == 0) {
            creep.memory.hauling = false;
	    }
	    if(!creep.memory.hauling && creep.store.getFreeCapacity() == 0) {
	        creep.memory.hauling = true;
	    }

        if(creep.memory.hauling) {
            var targets = creep.room.find(FIND_STRUCTURES, {
                    filter: (structure) => {
                        return (structure.structureType == STRUCTURE_TOWER ||
                            structure.structureType == STRUCTURE_EXTENSION || 
                            structure.structureType == STRUCTURE_SPAWN
                             && structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0);
                    }
            });

            if (targets.length > 0) {
                for (var target of targets) {
                    if (creep.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(target, {visualizePathStyle: {stroke: '#7DDA58'}});
                    }
                    if (target.store.getFreeCapacity(RESOURCE_ENERGY) == 0) {
                        break; // Stop transferring if the tower is full
                    }
                }

                // if(creep.transfer(targets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                //     creep.moveTo(targets[0], {visualizePathStyle: {stroke: '#7DDA58'}});
                //                     }
            }
        } else {

            var dropped_energy = creep.room.find(FIND_DROPPED_RESOURCES)
            if (dropped_energy.length > 0) {
                if (creep.pickup(dropped_energy[0]) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(dropped_energy[0], {visualizePathStyle: {stroke: '#FFDE59'}});
                                    }
            }

            var tomb = creep.pos.findClosestByPath(FIND_TOMBSTONES);
            if (tomb) {
                    if (creep.withdraw(tomb, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(tomb, {visualizePathStyle: {stroke: '#FFDE59'}});
                                    }
            };

            var containers = creep.room.find(FIND_STRUCTURES, {
                filter: (structure) => {
                    return (structure.structureType == STRUCTURE_CONTAINER)
                }
            });

            if (containers.length > 0) {
                for (var container of containers) {
                    if (container.store[RESOURCE_ENERGY] > 0) {
                        if (creep.withdraw(container, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                            creep.moveTo(container, {visualizePathStyle: {stroke: '#FFDE59'}});
                        }
                    }
                }
            }
        }
    }

	//     if(creep.memory.hauling) {
	//         var targets = creep.room.find(FIND_CONSTRUCTION_SITES);
	// 		// filter: {structureType: STRUCTURE_EXTENSION}});
	// 		targets.sort((b,a) => (a.progressTotal - a.progress) - (b.progressTotal - b.progress));
	// 		// console.log(targets);
    //         if(targets.length) {
	// 			if(creep.build(targets[0]) == ERR_NOT_IN_RANGE) {
	// 				creep.moveTo(targets[0], {visualizePathStyle: {stroke: '#FE9900'}});
	// 				creep.say('🧺')
	// 			}
	// 		}
	// 	}
	//     else {
	//         var sources = creep.room.find(FIND_SOURCES);
    //         if(creep.harvest(sources[1]) == ERR_NOT_IN_RANGE) {
    //             creep.moveTo(sources[1], {visualizePathStyle: {stroke: '#FFDE59'}});
	// 			    //         }
	//     }
	// }
};

module.exports = roleHauler;