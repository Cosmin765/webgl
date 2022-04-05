interface AttribInfo {
    name: string,
    size: number,
    type: number,
    normalized: boolean,
    stride: number,
    offset: number
}

enum UniformType {
    FLOAT,
    VEC2,
    VEC3,
    VEC4,
    MAT2,
    MAT3,
    MAT4,
}

interface UniformInfo {
    name: string,
    type: UniformType,
    transpose?: boolean
}

interface DataInfo {
    attribInfo: AttribInfo[],
    uniformInfo: UniformInfo[],
}

interface DrawData {
    positionData?: Float32Array,
    colorData?: Uint8Array,
    normalData?: Float32Array,
    indexData?: Uint32Array
}

interface FaceComponentData {
    vertex: number,
    texCoord: number,
    normal: number
}

type FaceData = FaceComponentData[];

type Color = [ number, number, number, number ];

export { AttribInfo, DrawData, UniformInfo, UniformType, Color, DataInfo, FaceComponentData, FaceData };