"""
Erzeugt eine 3D-Höhlen-Map für LightKnight Level-Design.
Stil: dunkle Höhle mit violettem Schimmer, Lichtquellen und Nebel.
KEINE Pixel-Art — echte 3D-Geometrie mit realistischer Beleuchtung.
"""
import bpy
import math
import mathutils

# ─── Clean ---
bpy.ops.wm.read_factory_settings(use_empty=True)
bpy.ops.object.select_all(action='SELECT')
bpy.ops.object.delete()

scene = bpy.context.scene

# ─── World / Hintergrund ---
if bpy.context.scene.world is None:
    bpy.context.scene.world = bpy.data.worlds.new("World")

world = bpy.context.scene.world
world.use_nodes = True
bg_node = None
for node in world.node_tree.nodes:
    if node.bl_idname == 'ShaderNodeTexEnvironment' or node.type == 'BACKGROUND':
        bg_node = node
if bg_node:
    bg_node.inputs[0].default_value = (0.04, 0.06, 0.13, 1.0)  # RGBA in Blender 5.1
    bg_node.inputs[1].default_value = 0.8
else:
    bg_node = world.node_tree.nodes.new(type='ShaderNodeBackground')
    bg_node.inputs[0].default_value = (0.04, 0.06, 0.13, 1.0)  # RGBA
    bg_node.inputs[1].default_value = 0.8

# ─── Render-Engine (EEVEE für schnelles Preview) ---
scene = bpy.context.scene
scene.render.engine = 'BLENDER_EEVEE'
scene.render.resolution_x = 1280
scene.render.resolution_y = 720
scene.render.film_transparent = True

# ─── Höhlen-Wand (Kuppel) ---
bpy.ops.mesh.primitive_uv_sphere_add(segments=32, ring_count=16, radius=8)
cave_shell = bpy.context.object
cave_shell.name = "cave_shell"
cave_shell.location = (0, 0, 4)
# Invertiere nach innen (sichtbar von innen)
bpy.ops.object.mode_set(mode='EDIT')
bpy.ops.mesh.select_all(action='SELECT')
bpy.ops.mesh.flip_normals()
bpy.ops.object.mode_set(mode='OBJECT')

# Wand-Material (dunkelviolett, leicht strukturiert)
mat_shell = bpy.data.materials.new(name="cave_shell_mat")
mat_shell.use_nodes = True
bsdf_shell = mat_shell.node_tree.nodes.get('Principled BSDF')
if bsdf_shell:
    bsdf_shell.inputs['Base Color'].default_value = (0.12, 0.10, 0.22, 1.0)  # #1e1a33
    bsdf_shell.inputs['Roughness'].default_value = 0.9
cave_shell.data.materials.append(mat_shell)

# ─── Bodenplatten ---
platform_positions = [
    # Level-1-Plattformen (aus level-config.ts)
    (200, 470, 32, 32), (420, 420, 32, 32), (650, 370, 32, 32),
    (850, 320, 32, 32), (1050, 270, 32, 32), (1250, 320, 32, 32),
    (1450, 370, 32, 32), (1650, 420, 32, 32), (320, 570, 48, 16),
    (550, 570, 48, 16), (800, 570, 48, 16), (1050, 570, 48, 16),
    (1300, 570, 48, 16), (650, 520, 32, 32), (950, 520, 32, 32),
    # Level-2-Plattformen (Auszug)
    (200, 400, 32, 32), (450, 400, 32, 32), (700, 400, 32, 32),
    (950, 400, 32, 32), (1200, 400, 32, 32), (1450, 400, 32, 32),
    (1700, 400, 32, 32), (320, 550, 48, 16), (580, 550, 48, 16),
    (850, 550, 48, 16), (1120, 550, 48, 16), (1400, 550, 48, 16),
    (1680, 550, 48, 16), (700, 350, 32, 32), (1000, 350, 32, 32),
    (1300, 350, 32, 32), (1600, 350, 32, 32), (1900, 350, 32, 32),
    (500, 280, 32, 32), (800, 280, 32, 32), (1100, 280, 32, 32),
    (1400, 280, 32, 32), (1700, 280, 32, 32),
]

mat_platform = bpy.data.materials.new(name="platform_mat")
mat_platform.use_nodes = True
bsdf_plat = mat_platform.node_tree.nodes.get('Principled BSDF')
if bsdf_plat:
    bsdf_plat.inputs['Base Color'].default_value = (0.17, 0.10, 0.30, 1.0)  # #2d1a4d
    bsdf_plat.inputs['Roughness'].default_value = 0.85
    # Moos-Akzent
    noise_tex = mat_platform.node_tree.nodes.new('ShaderNodeTexNoise')
    noise_tex.inputs['Scale'].default_value = 8.0
    noise_tex.inputs['Detail'].default_value = 2.0
    noise_tex.inputs['Distortion'].default_value = 0.5
    mix = mat_platform.node_tree.nodes.new('ShaderNodeMixRGB')
    mix.blend_type = 'MULTIPLY'
    mix.inputs['Fac'].default_value = 0.6
    mix.inputs[2].default_value = (0.22, 0.48, 0.22, 1.0)  # Moosgrün
    mat_platform.node_tree.links.new(noise_tex.outputs['Fac'], mix.inputs['Fac'])
    mat_platform.node_tree.links.new(bsdf_plat.outputs['BSDF'], mix.inputs[1])
    mat_platform.node_tree.links.new(mix.outputs['Color'], bsdf_plat.inputs['Base Color'])

platform_objects = []
for i, (px, py, pw, ph) in enumerate(platform_positions):
    # 3D-Koordinaten: Phaser X→Blender X, Phaser Y (nach unten) → Blender Y (nach oben negativ)
    bx = px - 1000  # Zentrieren (Level ist ca. 2000 breit, Blender Zentrum bei 0)
    by = py - 360   # Invertiere Y-Achse (Phaser Y+ = runter, Blender Y+ = oben)
    bz = -10        # leicht unterhalb
    
    bpy.ops.mesh.primitive_cube_add(size=1)
    plat = bpy.context.object
    plat.name = f"platform_{i:02d}"
    plat.scale = (pw/2, ph/2, 0.3)
    plat.location = (bx, by, bz)
    plat.data.materials.append(mat_platform)
    platform_objects.append(plat)

# --- Sammeldungen (Collectibles) an ihrer Position ---
collectible_positions = [
    (200, 460, 'health'), (600, 460, 'health'),
    (1000, 320, 'mana'), (1500, 420, 'speed_boost'),
]

# --- Gegnerpositionen ---
enemy_positions = [
    (220, 440), (450, 370), (700, 270),
    (1050, 270), (1450, 370), (1700, 420),
]

# ─── Lichtquellen (entsprechen Level-Design) ---
light_count = 0
# Player-Start Licht (warmes Weiß)
bpy.ops.object.light_add(type='AREA', location=(0, -370, 50))
light = bpy.context.object
light.data.energy = 200
light.data.size = 15
light.data.color = (1.0, 0.95, 0.85)  # warmes Weiß (Point light = RGB)
light_count += 1

# Platform-Lichter
for px, py, _, _ in platform_positions:
    bx = (px - 1000) * 0.05
    by = -((py - 360) * 0.05) + 50
    bpy.ops.object.light_add(type='POINT', location=(bx, by, 50))
    light = bpy.context.object
    light.data.energy = 50
    light.data.color = (0.5, 0.0, 1.0)  # Violett (Point light = RGB)
    light_count += 1

# Gegner-Lichter (rotviolett)
for ex, ey in enemy_positions:
    bx = (ex - 1000) * 0.05
    by = -((ey - 360) * 0.05) + 50
    bpy.ops.object.light_add(type='POINT', location=(bx, by, 30))
    light = bpy.context.object
    light.data.energy = 30
    light.data.color = (1.0, 0.0, 0.5)  # Rotviolett (Point light = RGB)
    light_count += 1  # Rotviolett

# Collectible-Lichter
collectible_light_colors = {
    'health': (1.0, 0.2, 0.2),
    'mana': (0.2, 0.6, 1.0),
    'speed_boost': (1.0, 0.7, 0.0),
}
for cx, cy, ctype in collectible_positions:
    bx = (cx - 1000) * 0.05
    by = -((cy - 360) * 0.05) + 50
    bpy.ops.object.light_add(type='POINT', location=(bx, by, 40))
    light = bpy.context.object
    light.data.energy = 80
    light.data.color = collectible_light_colors.get(ctype, (1.0, 1.0, 1.0))

# ─── Kamera (Frontend-Ansicht, leicht schräg) ---
bpy.ops.object.camera_add(location=(0, -15, 15))
cam = bpy.context.object
scene.camera = cam
# Kamera auf Level-Mittelpunkt richten
direction = mathutils.Vector((0, 0, 0)) - cam.location
cam.rotation_euler = direction.to_track_quat('-Z', 'Y').to_euler()

# ─── Render-Einstellungen ---
scene.render.engine = 'BLENDER_EEVEE'
scene.eevee.taa_render_samples = 16
# Bloom (neuer API-Name in Blender 5.1)
try:
    scene.eevee.use_bloom = True
    scene.eevee.bloom_intensity = 0.15
    scene.eevee.bloom_radius = 6.0
    scene.eevee.bloom_color = (0.1, 0.0, 0.2, 1.0)
except AttributeError:
    try:
        scene.eevee.bloom.use = True
        scene.eevee.bloom.intensity = 0.15
        scene.eevee.bloom.radius = 6.0
    except AttributeError:
        pass  # Bloom nicht verfügbar, überspringen
try:
    scene.eevee.use_motion_blur = False
except AttributeError:
    pass
scene.view_settings.look = 'AgX - Base Contrast'  # cinematic contrast (Blender 5.1)

# ─── VERIFY ---
print("=== VERIFY ===")
print(f"Engine: {scene.render.engine}")
print(f"Camera: {cam.name} at {cam.location}")
print(f"Platforms: {len(platform_objects)}")
print(f"Lights: {light_count}")
print(f"Resolution: {scene.render.resolution_x}x{scene.render.resolution_y}")
print("RENDERED")

# ─── Render ---
scene.render.filepath = "/Users/danielpaul/Desktop/LightKnight/assets/hollow_cave_preview.png"
bpy.ops.render.render(write_still=True)
print("SAVED: hollow_cave_preview.png")