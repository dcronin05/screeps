var roleRepairer = {

    /** @param {Creep} creep **/
    run: function(creep) {

	    if(creep.memory.repairing && creep.store[RESOURCE_ENERGY] == 0) {
            creep.memory.repairing = false;
            creep.say('🔄 harvest');
	    }
	    if(!creep.memory.repairing && creep.store.getFreeCapacity() == 0) {
	        creep.memory.repairing = true;
	        creep.say('🚧 repair');
	    }

	    if(creep.memory.repairing) {
	        var targets = creep.room.find(FIND_STRUCTURES, { 
				filter: object => object.hits < 30000
			});
			targets.sort((a,b) => a.hits - b.hits);
			if(Game.time % 2 == 0) {
				console.log("Repairing " + targets[2].structureType + " with ID: " + targets[2].id);
			}
			if(targets.length > 0) {
				if(creep.repair(targets[2]) == ERR_NOT_IN_RANGE) {
					creep.moveTo(targets[2], {visualizePathStyle: {stroke: '#7DDA58'}});
					creep.say('Repairing...');
				}
			}
			else {
				var targets = creep.room.find(FIND_CONSTRUCTION_SITES);
            	if(targets.length) {
                	if(creep.build(targets[0]) == ERR_NOT_IN_RANGE) {
                    	creep.moveTo(targets[0], {visualizePathStyle: {stroke: '#FE9900'}});
						creep.say('Building...');
                	}
          		}
			}
	    }
	    else {
	        var sources = creep.room.find(FIND_SOURCES);
            if(creep.harvest(sources[1]) == ERR_NOT_IN_RANGE) {
                creep.moveTo(sources[1], {visualizePathStyle: {stroke: '#FFDE59'}});
				creep.say('Harvesting...');
            }
	    }
	}
};

module.exports = roleRepairer;