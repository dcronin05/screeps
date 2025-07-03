var roleHauler = {

    /** @param {Creep} creep **/
    run: function(creep) {
        // temporarily flag creeps as alive until all haulers have TTL above 1000
        creep.memory.dying = false;
        if (creep.ticksToLive > 1000) { creep.memory.dying = false; creep.say('living'); }
        if (creep.ticksToLive < 500) { creep.memory.dying == true; creep.say('dying'); }

	    if(!creep.memory.dying && creep.memory.hauling && creep.store[RESOURCE_ENERGY] == 0) {
            creep.memory.hauling = false;
	    }
	    if(!creep.memory.dying && !creep.memory.hauling && creep.store.getFreeCapacity() == 0) {
	        creep.memory.hauling = true;
	    }

        if(!creep.memory.dying && creep.memory.hauling) {
            var targets = creep.room.find(FIND_STRUCTURES, {
                    filter: (structure) => {
                        return ((structure.structureType == STRUCTURE_TOWER ||
                            structure.structureType == STRUCTURE_EXTENSION ||
                            structure.structureType == STRUCTURE_SPAWN ||
                            structure.structureType == STRUCTURE_STORAGE
                        ) && structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0);
                    }
            });

            targets.sort((a,b) => a.store.getFreeCapacity(RESOURCE_ENERGY) - b.store.getFreeCapacity(RESOURCE_ENERGY));

            // for (var target of targets) {
            //     console.log(target.structureType + ' ' + target.id + ' ' + target.store.getFreeCapacity(RESOURCE_ENERGY) + ' ' + target.pos.x + 'x' + target.pos.y);
            // }

            if (targets.length > 0 && targets[0].structureType != STRUCTURE_STORAGE) {
                target = creep.pos.findClosestByRange(targets);

                for (var priority of targets) { 
                    if (priority.structureType == STRUCTURE_TOWER && priority.store.getFreeCapacity(RESOURCE_ENERGY) > 199) {
                        target = priority;
                    }
                    if (priority.structureType == STRUCTURE_STORAGE && creep.memory.skill == 'storage') {
                        target = priority
                    }
                }

                if(creep.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(target, {visualizePathStyle: {stroke: '#7DDA58'}});
                    creep.say('🚚');
                }
            }
            else if (targets.length == 1) {
                target = creep.pos.findClosestByRange(targets);
                if(creep.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(target, {visualizePathStyle: {stroke: '#7DDA58'}});
                    creep.say('🏪');
                }
            }
        } 
        else if (!creep.memory.dying) {
            var energy = creep.room.find(FIND_DROPPED_RESOURCES);
            
            energy = energy.concat(creep.room.find(FIND_STRUCTURES, {
                filter: (structure) => { return (
                    structure.structureType == STRUCTURE_CONTAINER && 
                    structure.store[RESOURCE_ENERGY] > 0 &&
                    creep.moveTo(structure) != ERR_NO_PATH
                )}
            }));
            energy = energy.concat(creep.room.find(FIND_TOMBSTONES, {
                filter: (tombstone) => { return (tombstone.store[RESOURCE_ENERGY] > 0) &&
                    creep.moveTo(tombstone) != ERR_NO_PATH }
            }));
            energy = energy.concat(creep.room.find(FIND_RUINS, {
                filter: (ruin) => { return (ruin.store[RESOURCE_ENERGY] > 0) &&
                    creep.moveTo(ruin) != ERR_NO_PATH }
            }));
            
            if (energy.length > 0) {
                target = creep.pos.findClosestByRange(energy);

            // TODO: finish unreachable target logic
            

            //     for (var step of creep.pos.findPathTo(target) ) {
            //         if 
            //     }
                
                
                for (var ruin of energy) {
                    if (ruin.structure) {
                        target = ruin;
                        console.log('ruin found: ' + target.id + ' ' + target.pos.x + 'x' + target.pos.y);
                    }
                }
                // console.log('Found energy: ' + target.type + ' ' + target.pos.x + 'x' + target.pos.y);

                if (target.structureType == STRUCTURE_CONTAINER) {
                    if (creep.withdraw(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(target, {visualizePathStyle: {stroke: '#FFDE59'}});
                    }
                    creep.say('🫙');
                }
                else if (target.store) {
                    if (creep.withdraw(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(target, {visualizePathStyle: {stroke: '#FFDE59'}});
                    }
                    creep.say('🛻');
                }
                else {
                    if (creep.pickup(target) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(target, {visualizePathStyle: {stroke: '#FFDE59'}});
                    }
                    creep.say('🫳')
                }
            }

        }
        else {
            creep.say('🏥')
            if (creep.rangeTo(Game.spawns['Spawn1']) > 1) {
                creep.moveTo(Game.spawns['Spawn1']);
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