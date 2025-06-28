var roleHarvester = {

    /** @param {Creep} creep **/
    run: function(creep) {
	      if(creep.store.getFreeCapacity() > 0) {
            var sources = creep.room.find(FIND_SOURCES);
            if(creep.harvest(sources[0]) == ERR_NOT_IN_RANGE) {
                creep.moveTo(sources[0], {visualizePathStyle: {stroke: '#FFDE59'}});
                
                creep.say('🚚🔄');
            }
        }
        else {
            var targets = creep.room.find(FIND_STRUCTURES, {
                    filter: (structure) => {
                        return (structure.structureType == STRUCTURE_TOWER ||
                            structure.structureType == STRUCTURE_EXTENSION || 
                            structure.structureType == STRUCTURE_SPAWN) &&
                            structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
                    }
            });
            if(targets.length > 0) {
                for (var target of targets) {
                    while (target.structureType == STRUCTURE_TOWER) {
                        if (creep.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                            creep.moveTo(target, {visualizePathStyle: {stroke: '#7DDA58'}});
                            creep.say('🚚');
                        }
                        if (target.store.getFreeCapacity(RESOURCE_ENERGY) == 0) {
                            break; // Stop transferring if the tower is full
                        }
                    }
                }

                if(creep.transfer(targets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(targets[0], {visualizePathStyle: {stroke: '#7DDA58'}});
                    creep.say('🚚');
                }
            }
        }
	}
};

module.exports = roleHarvester;