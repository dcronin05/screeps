var roleHarvester = {
    /** @param {Creep} creep **/
    run: function(creep) {
        creep.say('🪏');

        // Check if creep is dying / renew logic dynamically
        var spawns = creep.room.find(FIND_MY_STRUCTURES, {
            filter: (s) => s.structureType == STRUCTURE_SPAWN
        });
        var spawn = spawns.length > 0 ? spawns[0] : null;

        if (spawn) {
            if (creep.ticksToLive > 1499 || spawn.store.getUsedCapacity(RESOURCE_ENERGY) < 300) { 
                creep.memory.dying = false; 
            }
        }

        if (!creep.memory.dying) {
            var source = null;
            if (creep.memory.sourceId) {
                source = Game.getObjectById(creep.memory.sourceId);
            }
            
            // Fallback if no sourceId or it is invalid
            if (!source) {
                var sources = creep.room.find(FIND_SOURCES);
                if (sources.length > 0) {
                    source = creep.pos.findClosestByRange(sources);
                    if (source) {
                        creep.memory.sourceId = source.id;
                    }
                }
            }

            if (source) {
                if (creep.harvest(source) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(source, { visualizePathStyle: { stroke: '#ffaa00' } });
                }
            }
        } else if (spawn) {
            if (creep.pos.getRangeTo(spawn) > 0) {
                creep.moveTo(spawn);
            }
        }
    }
};

module.exports = roleHarvester;