/* 1320 combinaciones posibles (grupo de 12, ordenados de a 3 teniendo en cuenta el orden) */
const aliasWordList = [  
    'PISO', 'PIEDRA', 'GALERA', 'SOMBRERO', 'AMARILLO', 'TECLADO',
    'TECHO', 'LADRILLO', 'PINTURA', 'CASA', 'VERDE', 'MONITOR'
]

const MIN = 0
const MAX = aliasWordList.length - 1;

function rand(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min
}

function createAlias(aliasList) {
    let numberCombination = []
    let newAlias = ''
    do {
        numberCombination[0] = rand(MIN, MAX)
        numberCombination[1] = rand(MIN, MAX)
        numberCombination[2] = rand(MIN, MAX)
        newAlias = aliasWordList[numberCombination[0]] + '.' + aliasWordList[numberCombination[1]] + '.' + aliasWordList[numberCombination[2]]
    } while (
        !(numberCombination[0] != numberCombination[1] &&
        numberCombination[1] != numberCombination[2] &&
        numberCombination[0] != numberCombination[2]) ||
        aliasList.some(alias => alias === newAlias)
    );
    return newAlias;
}

module.exports = createAlias;