var roleHarvester = {

    /** @param {Creep} creep **/
    run: function(creep) {

        var sources = creep.room.find(FIND_SOURCES);

        if (creep.ticksToLive > 1400 || Game.spawns['Spawn1'].store.getUsedCapacity(RESOURCE_ENERGY) <= 200) { 
            creep.memory.dying = false; 
        }
        if (creep.ticksToLive < 1000 && Game.spawns['Spawn1'].store.getUsedCapacity(RESOURCE_ENERGY) > 200) { 
            creep.memory.dying = true; 
            console.log(creep.name + ' is dying');
        }
        
        if(creep.memory.source == 0 && !creep.memory.dying) {
            if(creep.harvest(sources[0]) == ERR_NOT_IN_RANGE) {
                creep.moveTo(sources[0]);
            }
            if(sources[0].energy == 0) {
                creep.memory.source = 1; // Switch to the second source if the first is empty
            }
	    }
	    else if(creep.memory.source == 1 && !creep.memory.dying) {
            if(creep.harvest(sources[1]) == ERR_NOT_IN_RANGE) {
                creep.moveTo(sources[1]);
            }
            if(sources[1].energy == 0) {
                creep.memory.source = 0; // Switch to the first source if the second is empty
            }
        }
        else if (creep.memory.dying) {
            creep.say('🏥')
            if (creep.pos.getRangeTo(Game.spawns['Spawn1']) > 0) {
                creep.moveTo(Game.spawns['Spawn1']);
                console.log(creep.name + ' ' + creep.pos.getRangeTo(Game.spawns['Spawn1']) + ' away from spawn');
            }
        }
        else {
            creep.memory.source = 0; // Default to the first source if no valid source is set
        }

    }

};

module.exports = roleHarvester;