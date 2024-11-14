import { useRef, useState } from "react";
import styled from "styled-components";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

import { UploadedModel } from "./components/model";
import { CameraBookmarks } from "./components/cameraBookmarks";

function App() {
  const [modelFile, setModelFile] = useState<File | null>(null);
  const [textureFile, setTextureFile] = useState<File | null>(null);
  const [nightMode, setNightMode] = useState<boolean>(false);
  const [cameraBookmarks, setCameraBookmarks] = useState<
    { azimuthalAngle: number; polarAngle: number }[]
  >([]);
  const [autoRotate, setAutoRotate] = useState<boolean>(false);
  const [showSpotLights, setShowSpotLights] = useState<boolean>(false);
  const controlsRef = useRef(null!);
  const objectInputRef = useRef<HTMLInputElement>(null!);
  const textureInputRef = useRef<HTMLInputElement>(null!);

  const handleObjectFileUpload = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      setModelFile(file);
    }
  };

  const handleTextureFileUpload = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      setTextureFile(file);
    }
  };

  return (
    <PageContainer>
      <Heading>3D Model Viewer</Heading>
      <AppContainer>
        <CanvasContainer>
          <Canvas
            camera={{
              fov: 75,
              position: [40, 40, 15],
              rotation: [4000, 30, 30],
            }}
            style={{ background: nightMode ? "#0E0D0D" : "#BCBCBC" }}
          >
            <ambientLight
              intensity={nightMode ? 0.5 : 1}
              color={nightMode ? "#fde68a" : "white"}
            />
            <directionalLight
              intensity={nightMode ? 2.5 : 3.5}
              color={nightMode ? "#fde68a" : "white"}
            />
            <OrbitControls ref={controlsRef} />
            {modelFile && (
              <UploadedModel
                url={URL.createObjectURL(modelFile) || ""}
                textureUrl={
                  textureFile ? URL.createObjectURL(textureFile) : undefined
                }
                autoRotate={autoRotate}
                showSpotLights={showSpotLights}
              />
            )}

            <gridHelper />
          </Canvas>
        </CanvasContainer>
        <CameraControlsContainer>
          <Button
            variant={"secondary"}
            onClick={() =>
              // @ts-ignore
              controlsRef?.current?.setAzimuthalAngle?.(
                // @ts-ignore
                controlsRef?.current?.getAzimuthalAngle?.() + 0.2
              )
            }
          >
            Rotate Left
          </Button>
          <Button
            variant={"secondary"}
            onClick={() =>
              // @ts-ignore
              controlsRef?.current?.setAzimuthalAngle?.(
                // @ts-ignore
                controlsRef?.current?.getAzimuthalAngle?.() - 0.2
              )
            }
          >
            Rotate Right
          </Button>
        </CameraControlsContainer>

        <MenuContainer>
          <FileInputConainer>
            <div className="grid w-full max-w-sm items-center gap-1.5">
              <Label htmlFor="obj-file-uploader">Upload .obj file</Label>
              <Input
                ref={objectInputRef}
                type="file"
                accept=".obj"
                onChange={handleObjectFileUpload}
                id="obj-file-uploader"
              />
            </div>
            <StyledButton
              variant={"ghost"}
              onClick={() => {
                setModelFile(null);
              }}
              disabled={!modelFile}
            >
              Delete Model
            </StyledButton>
          </FileInputConainer>

          <FileInputConainer>
            <div className="grid w-full max-w-sm items-center gap-1.5">
              <Label htmlFor="texture-file-uploader">
                Upload texture file (.jpg, .png)
              </Label>
              <Input
                ref={textureInputRef}
                type="file"
                accept=".jpg, .png"
                onChange={handleTextureFileUpload}
                id="texture-file-uploader"
              />
            </div>
            <StyledButton
              variant={"ghost"}
              onClick={() => setTextureFile(null)}
              disabled={!textureFile}
            >
              Delete Texture
            </StyledButton>
          </FileInputConainer>

          <SwitchContainer>
            <Label htmlFor="toggle-night-mode">
              Toggle night scenery lighting
            </Label>
            <Switch
              id="toggle-night-mode"
              checked={nightMode}
              onClick={() => setNightMode((previousValue) => !previousValue)}
            />
          </SwitchContainer>

          <SwitchContainer>
            <Label htmlFor="toggle-spotlights">Toggle spotlights</Label>
            <Switch
              id="toggle-spotlights"
              checked={showSpotLights}
              onClick={() =>
                setShowSpotLights((previousValue) => !previousValue)
              }
            />
          </SwitchContainer>

          <SwitchContainer>
            <Label htmlFor="toggle-rotation">Toggle model auto rotation</Label>
            <Switch
              id="toggle-rotation"
              checked={autoRotate}
              onClick={() => setAutoRotate((previousValue) => !previousValue)}
            />
          </SwitchContainer>
          <Button
            variant={"secondary"}
            onClick={() => {
              setCameraBookmarks([
                ...cameraBookmarks,
                {
                  // @ts-ignore
                  azimuthalAngle: controlsRef?.current?.getAzimuthalAngle?.(),
                  // @ts-ignore
                  polarAngle: controlsRef?.current?.getPolarAngle?.(),
                },
              ]);
            }}
          >
            Bookmark This Camera Position
          </Button>

          <BookmarksContainer>
            <CameraBookmarks
              bookmarks={cameraBookmarks}
              onLoadClick={(bookmark) => {
                // @ts-ignore
                controlsRef?.current?.setAzimuthalAngle?.(
                  bookmark.azimuthalAngle
                );
                // @ts-ignore
                controlsRef?.current?.setPolarAngle?.(bookmark.polarAngle);
              }}
            />
          </BookmarksContainer>
        </MenuContainer>
      </AppContainer>
    </PageContainer>
  );
}

export default App;

const PageContainer = styled.main`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  width: 100vw;
  padding: 40px 10px;
  background-image: linear-gradient(
    rgb(0, 0, 0) 30%,
    rgb(17, 17, 17) 50%,
    rgb(17, 17, 17) 100%
  );
`;

const AppContainer = styled.div`
  position: relative;
  display: flex;
  width: 100%;
  max-width: 1200px;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 20px;
  background: #09090b;
  border: 1px solid #3f3f46;
  border-radius: 20px;
  box-shadow: 0px 2px 21.9px 0px #ffffff40;
`;

const Heading = styled.h1`
  font-size: 70px;
  font-weight: 700;
  margin: 40px 0;
  background: -webkit-linear-gradient(180deg, #f5f5f5 20%, #adadad 100%);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
`;

const CanvasContainer = styled.div`
  height: 60vh;
  width: 100%;
  border: 1px solid #27272a;
  border-radius: 10px;
  overflow: hidden;
  position: relative;
`;

const BookmarksContainer = styled.div`
  width: 100%;
  max-width: 500px;
`;

const FileInputConainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: start;
  width: 250px;
  gap: 10px;
`;

const StyledButton = styled(Button)`
  border: 1px solid #d4d4d8;
`;

const SwitchContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
`;

const CameraControlsContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
  margin: 10px 0;
`;

const MenuContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 20px;

  @media screen and (min-width: 600px) {
    position: absolute;
    top: 20px;
    left: 20px;
    background-color: rgba(24, 24, 27, 0.8);
    border-radius: 10px;
    border: 1px solid #3f3f46;
    padding: 10px;
  }
`;
