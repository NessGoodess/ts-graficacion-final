import * as THREE from 'three';

export function createAxesHelper(object: THREE.Object3D, size: number = 2): THREE.AxesHelper {
    const axesHelper = new THREE.AxesHelper(size);
    axesHelper.renderOrder = 1;
    object.add(axesHelper);
    return axesHelper;
}

export function toggleAxesVisibility(helpers: THREE.AxesHelper[]): boolean {
    const newVisibility = !(helpers[0]?.visible ?? true);
    helpers.forEach(helper => {
        if (helper) helper.visible = newVisibility;
    });
    return newVisibility;
}