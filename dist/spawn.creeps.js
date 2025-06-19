var spawnCreeps = {
    run: function(spawn) {
        var numCreeps = 0;
        for (var creep in Game.creeps) {
            numCreeps++;
        }
        var creepName = 'Harvester' + (numCreeps + 1);
        if (Game.creeps[creepName]) {
            creepName = 'Harvester' + (numCreeps + 2);
        }

        if (spawn.energy > 99 ) {
            spawn.spawnCreep([WORK, CARRY, MOVE], creepName);

            console.log('Spawning new creep: ' + creepName);
        }
    }
}

module.exports = spawnCreeps;