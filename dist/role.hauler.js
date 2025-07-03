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

                for (var tower of targets) { 
                    if (tower.structureType == STRUCTURE_TOWER && tower.store.getFreeCapacity(RESOURCE_ENERGY) > 199) {
                        target = tower;
                    }
                }

                if(creep.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(target, {visualizePathStyle: {stroke: '#7DDA58'}});
                    creep.say(target.pos.x + 'x' + target.pos.y + 'y');
                }
            }
            else if (targets.length == 1) {
                target = creep.pos.findClosestByRange(targets);
                if(creep.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(target, {visualizePathStyle: {stroke: '#7DDA58'}});
                    creep.say(target.pos.x + 'x' + target.pos.y + 'y');
                }
            }
        } 
        else {
            var energy = creep.room.find(FIND_DROPPED_RESOURCES)
            energy = energy.concat(creep.room.find(FIND_STRUCTURES, {
                filter: (structure) => { return (structure.structureType == STRUCTURE_CONTAINER && structure.store[RESOURCE_ENERGY] > 0); }
            }));
            energy = energy.concat(creep.room.find(FIND_TOMBSTONES, {
                filter: (tombstone) => { return (tombstone.store[RESOURCE_ENERGY] > 0); }
            }));
            energy = energy.concat(creep.room.find(FIND_RUINS, {
                filter: (ruin) => { return (ruin.store[RESOURCE_ENERGY] > 0); }
            }));
            
            
            if (energy.length > 0) {
                target = creep.pos.findClosestByRange(energy);
                
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
                    creep.say(🫙);
                }
                else if (target.store) {
                    if (creep.withdraw(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(target, {visualizePathStyle: {stroke: '#FFDE59'}});
                    }
                    creep.say(🛻);
                }
                else {
                    if (creep.pickup(target) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(target, {visualizePathStyle: {stroke: '#FFDE59'}});
                    }
                    creep.say(🫳)
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