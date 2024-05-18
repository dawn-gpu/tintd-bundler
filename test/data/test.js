
export const c2 = `// wgsl
  struct VSUniforms {
    worldViewProjection: mat4x4<f32>,
    worldInverseTranspose: mat4x4<f32>,
  };
  @group(0) @binding(0) var<uniform> vsUniforms: VSUniforms;
  @vertex
  fn myVSMain(v: MyVSInput) -> MyVSOutput {
    var vsOut: MyVSOutput;
    vsOut.position = vsUniforms.worldViewProjection * v.position;
    vsOut.normal = (vsUniforms.worldInverseTranspose * vec4<f32>(v.normal, 0.0)).xyz;
    vsOut.texcoord = v.texcoord;
    return vsOut;
  }
`;

export const c1 = /* wgsl */`
  struct VSUniforms {
    worldViewProjection: mat4x4<f32>,
    worldInverseTranspose: mat4x4<f32>,
  };
  @group(0) @binding(0) var<uniform> vsUniforms: VSUniforms;

  struct MyVSInput {
      @location(0) position: vec4<f32>,
      @location(1) normal: vec3<f32>,
      @location(2) texcoord: vec2<f32>,
  };

  struct MyVSOutput {
    @builtin(position) position: vec4<f32>,
    @location(0) normal: vec3<f32>,
    @location(1) texcoord: vec2<f32>,
  };

  @vertex
  fn myVSMain(v: MyVSInput) -> MyVSOutput {
    var vsOut: MyVSOutput;
    vsOut.position = vsUniforms.worldViewProjection * v.position;
    vsOut.normal = (vsUniforms.worldInverseTranspose * vec4<f32>(v.normal, 0.0)).xyz;
    vsOut.texcoord = v.texcoord;
    return vsOut;
  }

  struct FSUniforms {
    lightDirection: vec3<f32>,
  };

  @group(0) @binding(1) var<uniform> fsUniforms: FSUniforms;
  @group(0) @binding(2) var diffuseSampler: sampler;
  @group(0) @binding(3) var diffuseTexture: texture_2d<f32>;

  @fragment
  fn myFSMain(v: MyVSOutput) -> @location(0) vec4<f32> {
    var diffuseColor = textureSample(diffuseTexture, diffuseSampler, v.texcoord);
    var a_normal = normalize(v.normal);
    var l = dot(a_normal, fsUniforms.lightDirection) * 0.5 + 0.5;
    return vec4<f32>(diffuseColor.rgb * l, diffuseColor.a);
  }
`;
