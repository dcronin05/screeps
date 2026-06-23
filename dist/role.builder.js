var roleBuilder = {
    /** @param {Creep} creep **/
    run: function(creep) {
        creep.say('🏗️');

	    if(creep.memory.building && creep.store[RESOURCE_ENERGY] == 0) {
            creep.memory.building = false;
	    }
	    if(!creep.memory.building && creep.store.getFreeCapacity() == 0) {
	        creep.memory.building = true;
	    }

	    if(creep.memory.building) {
	        var targets = creep.room.find(FIND_CONSTRUCTION_SITES, { 
				filter: (structure) => {
					return ((structure.structureType == STRUCTURE_EXTENSION 
						|| structure.structureType == STRUCTURE_ROAD 
						|| structure.structureType == STRUCTURE_CONTAINER
						|| structure.structureType == STRUCTURE_STORAGE
						|| structure.structureType == STRUCTURE_WALL
                        || structure.structureType == STRUCTURE_TOWER
                        || structure.structureType == STRUCTURE_LINK
                        || structure.structureType == STRUCTURE_LAB
                        || structure.structureType == STRUCTURE_EXTRACTOR)
						&& structure.progress <= 50000)
					}
			});
			targets.sort((a, b) => (a.progressTotal - a.progress) - (b.progressTotal - b.progress));
            if(targets.length) {
				if(creep.build(targets[0]) == ERR_NOT_IN_RANGE) {
					creep.moveTo(targets[0], { visualizePathStyle: { stroke: '#FE9900' } });
				}
			}
		}
	    else {
            // Find container or storage first
            var energy_stores = creep.room.find(FIND_STRUCTURES, {
                filter: (structure) => (structure.structureType == STRUCTURE_STORAGE || structure.structureType == STRUCTURE_CONTAINER) && structure.store[RESOURCE_ENERGY] > 50
            });
            if (energy_stores.length > 0) {
                var store = creep.pos.findClosestByRange(energy_stores);
                if (store) {
                    if (creep.withdraw(store, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(store, { visualizePathStyle: { stroke: '#FFDE59' } });
                    }
                }
            } else {
                // Fallback to harvesting if no storage or containers exist yet
                var sources = creep.room.find(FIND_SOURCES);
                var source = creep.pos.findClosestByRange(sources);
                if (source) {
                    if (creep.harvest(source) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(source, { visualizePathStyle: { stroke: '#FFDE59' } });
                    }
                }
            }
	    }
	}
};

module.exports = roleBuilder;