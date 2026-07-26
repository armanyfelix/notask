import { documentDir, homeDir, join } from "@tauri-apps/api/path";
import { getCurrentWindow, LogicalSize } from "@tauri-apps/api/window";
import { open } from "@tauri-apps/plugin-dialog";
import { mkdir } from "@tauri-apps/plugin-fs";
import gsap from "gsap";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Button, Input } from "react-aria-components";
import { useNavigate } from "react-router-dom";
import WindowButtons from "@/layout/WindowButtons";
import { registerExistingVault, registerVault } from "@/utils/vaults";

export default function InitialSetup() {
  const [showWelcome, setShowWelcome] = useState<boolean>(true);
  const [isTransitioning, setIsTransitioning] = useState<boolean>(false);
  const [createVault, setCreateVault] = useState<boolean>(false);
  const [newVaultName, setNewVaultName] = useState<string>("");
  const [isValidName, setIsValidName] = useState<boolean>(true);
  const [selectedLocation, setSelectedLocation] = useState<string>("");
  const [alert, setAlert] = useState<string>("");
  const [isSavingVault, setIsSavingVault] = useState<boolean>(false);
  const navigate = useNavigate();
  const welcomeRef = useRef<HTMLElement>(null);
  const setupRef = useRef<HTMLDivElement>(null);

  const appWindow = getCurrentWindow();

  const onSelectLocation = async () => {
    const location = await open({
      directory: true,
      defaultPath: await documentDir(),
    });
    if (location !== null) {
      return location;
    }
  };

  const onBrowseLocation = async () => {
    const location = await onSelectLocation();
    if (location) {
      setSelectedLocation(location);
    }
  };

  const onOpenFolder = async () => {
    const location = await onSelectLocation();
    if (!location) return;

    try {
      setIsSavingVault(true);
      await registerExistingVault(location);
      navigate("/");
    } catch (error) {
      setAlert(`Could not open this vault: ${String(error)}`);
    } finally {
      setIsSavingVault(false);
    }
  };

  const onQuickStart = async () => {
    try {
      setIsSavingVault(true);
      const defaultVaultPath = await join(await homeDir(), "Zag Vault");
      await mkdir(defaultVaultPath, { recursive: true });
      await registerVault("Zag Vault", defaultVaultPath);
      navigate("/");
    } catch (error) {
      setAlert(`Could not create the default vault: ${String(error)}`);
    } finally {
      setIsSavingVault(false);
    }
  };

  const onCreateVault = async () => {
    if (!newVaultName || !isValidName) {
      setAlert("Please, pick a valid vault name");
    } else if (!selectedLocation) {
      setAlert("Please, select a location");
    } else {
      try {
        setIsSavingVault(true);
        const vaultPath = await join(selectedLocation, newVaultName);
        await mkdir(vaultPath);
        await registerVault(newVaultName, vaultPath);
        navigate("/");
      } catch (error: any) {
        setAlert(`Could not create the vault: ${String(error)}`);
      } finally {
        setIsSavingVault(false);
      }
    }
  };

  const windowSize = async () => {
    await appWindow.setSize(new LogicalSize(600, 560));
    await appWindow.setMaximizable(false);
    await appWindow.setResizable(false);
  };

  const restoreWindow = async () => {
    await appWindow.setMaximizable(true);
    await appWindow.setResizable(true);
  };

  useEffect(() => {
    windowSize();
    return () => {
      restoreWindow();
    };
  }, []);

  useEffect(() => {
    setTimeout(() => {
      setAlert("");
    }, 6000);
  }, [alert]);

  useLayoutEffect(() => {
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (reduceMotion) return;

    const scope = showWelcome ? welcomeRef : setupRef;
    if (!scope.current) return;

    const context = gsap.context(() => {
      if (showWelcome) {
        const timeline = gsap.timeline({ defaults: { ease: "power3.out" } });

        timeline
          .fromTo(
            ".zag-welcome-glow",
            { autoAlpha: 0, scale: 0.55 },
            { autoAlpha: 1, scale: 1, duration: 1.8, stagger: 0.14 },
          )
          .fromTo(
            ".zag-welcome-mark",
            { autoAlpha: 0, y: 24, scale: 0.72, rotate: -8 },
            { autoAlpha: 1, y: 0, scale: 1, rotate: 0, duration: 0.75 },
            0.18,
          )
          .fromTo(
            ".zag-welcome-eyebrow",
            { autoAlpha: 0, y: 12, letterSpacing: "0.7em" },
            { autoAlpha: 1, y: 0, letterSpacing: "0.42em", duration: 0.65 },
            0.4,
          )
          .fromTo(
            ".zag-welcome-letter",
            { autoAlpha: 0, y: 60, rotateX: -70, filter: "blur(8px)" },
            {
              autoAlpha: 1,
              y: 0,
              rotateX: 0,
              filter: "blur(0px)",
              duration: 0.8,
              stagger: 0.055,
            },
            0.52,
          )
          .fromTo(
            ".zag-subtitle-character",
            { autoAlpha: 0, y: 14 },
            { autoAlpha: 1, y: 0, duration: 0.32, stagger: 0.035 },
            1.05,
          )
          .fromTo(
            ".zag-welcome-action",
            { autoAlpha: 0, y: 18, scale: 0.94 },
            { autoAlpha: 1, y: 0, scale: 1, duration: 0.55 },
            2.12,
          )
          .fromTo(
            ".zag-welcome-footnote",
            { autoAlpha: 0, y: 8 },
            { autoAlpha: 1, y: 0, duration: 0.5 },
            2.3,
          );

        gsap.to(".zag-welcome-caret", {
          autoAlpha: 0,
          duration: 0.45,
          repeat: -1,
          yoyo: true,
          ease: "steps(1)",
          delay: 1.1,
        });
      } else {
        gsap.fromTo(
          setupRef.current,
          { autoAlpha: 0, y: 22, scale: 0.975, filter: "blur(8px)" },
          {
            autoAlpha: 1,
            y: 0,
            scale: 1,
            filter: "blur(0px)",
            duration: 0.75,
            ease: "power3.out",
          },
        );
      }
    }, scope);

    return () => context.revert();
  }, [showWelcome, createVault]);

  const openGettingStarted = () => {
    if (isTransitioning) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setShowWelcome(false);
      return;
    }

    setIsTransitioning(true);
    const timeline = gsap.timeline({
      onComplete: () => {
        setShowWelcome(false);
        setIsTransitioning(false);
      },
    });

    timeline
      .to(".zag-welcome-action", {
        scale: 0.92,
        autoAlpha: 0,
        duration: 0.22,
        ease: "power2.in",
      })
      .to(
        ".zag-welcome-content",
        {
          y: -24,
          scale: 1.035,
          autoAlpha: 0,
          filter: "blur(12px)",
          duration: 0.6,
          ease: "power3.inOut",
        },
        0.08,
      )
      .to(
        ".zag-welcome-glow",
        {
          scale: 1.45,
          autoAlpha: 0,
          duration: 0.75,
          ease: "power2.inOut",
        },
        0.08,
      )
      .to(
        welcomeRef.current,
        { backgroundColor: "var(--color-base-100)", duration: 0.45 },
        0.28,
      );
  };

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.repeat) return;

      if (showWelcome) {
        if (event.key === "Enter") {
          event.preventDefault();
          openGettingStarted();
        }
        return;
      }

      const target = event.target as HTMLElement | null;
      const isEditing =
        target?.tagName === "INPUT" ||
        target?.tagName === "TEXTAREA" ||
        target?.isContentEditable;

      if (createVault) {
        if (event.key === "Escape") {
          event.preventDefault();
          setCreateVault(false);
        } else if (event.key === "Enter" && (event.ctrlKey || event.metaKey)) {
          event.preventDefault();
          void onCreateVault();
        } else if (!isEditing && event.key.toLowerCase() === "b") {
          event.preventDefault();
          void onBrowseLocation();
        }
        return;
      }

      if (isEditing || event.ctrlKey || event.metaKey || event.altKey) return;

      switch (event.key.toLowerCase()) {
        case "c":
          event.preventDefault();
          setCreateVault(true);
          break;
        case "o":
          event.preventDefault();
          void onOpenFolder();
          break;
        case "s":
          event.preventDefault();
          navigate("/signin");
          break;
        case "q":
          event.preventDefault();
          void onQuickStart();
          break;
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [showWelcome, createVault, isTransitioning]);

  return (
    <main className="h-screen overflow-hidden">
      {showWelcome ? (
        <section
          ref={welcomeRef}
          className="zag-welcome relative flex h-full items-center justify-center overflow-hidden px-8"
        >
          <div className="zag-welcome-glow zag-welcome-glow-one" />
          <div className="zag-welcome-glow zag-welcome-glow-two" />

          <div className="zag-welcome-content relative z-1 flex -translate-y-2 flex-col items-center text-center">
            <div className="zag-welcome-mark mb-5 flex size-14 items-center justify-center rounded-2xl border border-primary/25 bg-primary/10 text-primary shadow-lg shadow-primary/10">
              <span className="font-[Futura] text-4xl leading-none">Z</span>
            </div>
            <p className="zag-welcome-eyebrow mb-2 text-[0.68rem] font-bold tracking-[0.42em] text-primary uppercase">
              Meet Zag
            </p>
            <h1
              aria-label="Welcome"
              className="zag-welcome-title flex font-[Futura] text-[5.25rem] leading-none tracking-[-0.055em] text-base-content [perspective:500px]"
            >
              {Array.from("Welcome").map((character, index) => (
                <span
                  aria-hidden="true"
                  className="zag-welcome-letter inline-block"
                  key={`${character}-${index}`}
                >
                  {character}
                </span>
              ))}
            </h1>
            <div className="mt-5 h-7 max-w-full overflow-hidden">
              <p
                aria-label="Stop planning... Start acting"
                className="zag-welcome-subtitle whitespace-nowrap text-base text-base-content/65"
              >
                {Array.from("Stop planning... Start acting").map(
                  (character, index) => (
                    <span
                      aria-hidden="true"
                      className="zag-subtitle-character inline-block"
                      key={`${character}-${index}`}
                    >
                      {character === " " ? "\u00a0" : character}
                    </span>
                  ),
                )}
                <span
                  aria-hidden="true"
                  className="zag-welcome-caret ml-0.5 text-primary"
                >
                  |
                </span>
              </p>
            </div>
            <Button
              autoFocus
              aria-keyshortcuts="Enter"
              className="zag-welcome-action btn btn-primary btn-wide mt-12 rounded-full"
              isDisabled={isTransitioning}
              onPress={openGettingStarted}
            >
              Get started
              <span className="icon-[solar--arrow-right-linear] size-4" />
              <kbd className="kbd kbd-sm ml-1 border-primary-content/20 bg-primary-content/10 text-primary-content">
                Enter
              </kbd>
            </Button>
          </div>

          <div className="zag-welcome-footnote absolute bottom-5 flex items-center gap-2 text-[0.65rem] tracking-wide text-base-content/35">
            <span>Your space. Your thoughts. Your way.</span>
            <span aria-hidden="true">·</span>
            <span>Press Enter to continue</span>
          </div>
        </section>
      ) : (
        <>
          <div className="sticky top-0 right-0 left-0 h-7 z-9 flex items-center">
            <div
              data-tauri-drag-region
              className="w-full h-7 text-center inline-flex justify-center items-center"
            >
              <span className="pointer-events-none text-xs opacity-55">
                {showWelcome ? "Zag" : "Getting Started"}
              </span>
            </div>
            <WindowButtons noMaximizable />
          </div>
          <div ref={setupRef} className="p-5">
            {!createVault ? (
              <section
                aria-label="Initial setup"
                aria-roledescription="carousel"
                className="mx-auto max-w-[35rem]"
              >
                <header className="mb-5 flex items-start justify-between gap-5">
                  <div>
                    <p className="mb-1 text-[0.65rem] font-bold tracking-[0.28em] text-primary uppercase">
                      Storage & sync
                    </p>
                    <h2 className="font-[Futura] text-3xl leading-tight">
                      Where should Zag keep your data?
                    </h2>
                    <p className="mt-1 text-xs text-base-content/55">
                      Choose how this device connects to your workspace.
                    </p>
                  </div>
                  <span className="mt-1 text-xs text-base-content/40">
                    01 / 01
                  </span>
                </header>

                <div className="overflow-hidden" aria-live="polite">
                  <div className="flex transition-transform duration-500 ease-out">
                    <div className="grid min-w-full grid-cols-2 gap-3">
                      <Button
                        aria-keyshortcuts="S"
                        className="group relative flex min-h-32 flex-col items-start rounded-2xl border border-base-content/10 bg-base-200/55 p-4 text-left transition duration-200 hover:-translate-y-0.5 hover:border-primary/40 hover:bg-base-200 focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/30"
                        onPress={() => navigate("/signin")}
                      >
                        <span className="icon-[solar--cloud-bold-duotone] mb-3 size-6 text-primary" />
                        <strong className="text-sm">Zag account</strong>
                        <span className="mt-1 text-[0.68rem] leading-relaxed text-base-content/50">
                          Sign in or create an account to sync through Supabase.
                        </span>
                        <kbd className="kbd kbd-xs absolute top-3 right-3">
                          S
                        </kbd>
                      </Button>

                      <Button
                        aria-keyshortcuts="C"
                        className="group relative flex min-h-32 flex-col items-start rounded-2xl border border-base-content/10 bg-base-200/55 p-4 text-left transition duration-200 hover:-translate-y-0.5 hover:border-primary/40 hover:bg-base-200 focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/30"
                        onPress={() => setCreateVault(true)}
                      >
                        <span className="icon-[solar--add-folder-bold-duotone] mb-3 size-6 text-primary" />
                        <strong className="text-sm">Create a vault</strong>
                        <span className="mt-1 text-[0.68rem] leading-relaxed text-base-content/50">
                          Choose a folder and keep your data locally under your
                          control.
                        </span>
                        <kbd className="kbd kbd-xs absolute top-3 right-3">
                          C
                        </kbd>
                      </Button>

                      <Button
                        aria-keyshortcuts="O"
                        className="group relative flex min-h-32 flex-col items-start rounded-2xl border border-base-content/10 bg-base-200/55 p-4 text-left transition duration-200 hover:-translate-y-0.5 hover:border-primary/40 hover:bg-base-200 focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/30"
                        isDisabled={isSavingVault}
                        onPress={() => onOpenFolder()}
                      >
                        <span className="icon-[solar--folder-open-bold-duotone] mb-3 size-6 text-primary" />
                        <strong className="text-sm">Open a vault</strong>
                        <span className="mt-1 text-[0.68rem] leading-relaxed text-base-content/50">
                          Continue working from an existing Zag vault on this
                          computer.
                        </span>
                        <kbd className="kbd kbd-xs absolute top-3 right-3">
                          O
                        </kbd>
                      </Button>

                      <Button
                        aria-keyshortcuts="Q"
                        className="group relative flex min-h-32 flex-col items-start rounded-2xl border border-primary/30 bg-primary/8 p-4 text-left transition duration-200 hover:-translate-y-0.5 hover:border-primary/60 hover:bg-primary/12 focus-visible:ring-2 focus-visible:ring-primary/30"
                        isDisabled={isSavingVault}
                        onPress={() => onQuickStart()}
                      >
                        <span className="icon-[solar--magic-stick-3-bold-duotone] mb-3 size-6 text-primary" />
                        <strong className="text-sm">Getting started</strong>
                        <span className="mt-1 text-[0.68rem] leading-relaxed text-base-content/50">
                          Create “Zag Vault” in your home folder and start
                          immediately.
                        </span>
                        <kbd className="kbd kbd-xs absolute top-3 right-3">
                          Q
                        </kbd>
                      </Button>
                    </div>
                  </div>
                </div>

                <footer className="mt-5 flex items-center justify-between">
                  <div
                    className="flex items-center gap-1.5"
                    aria-label="Slide 1 of 1"
                  >
                    <span className="h-1.5 w-8 rounded-full bg-primary" />
                  </div>
                  <p className="text-[0.65rem] text-base-content/40">
                    Press the highlighted key to choose
                  </p>
                </footer>
              </section>
            ) : (
              <section className="mx-auto max-w-[34rem]">
                <div className="mb-7">
                  <Button
                    aria-keyshortcuts="Escape"
                    className="btn btn-ghost"
                    onPress={() => setCreateVault(false)}
                  >
                    <span className="icon-[solar--arrow-left-line-duotone]"></span>
                    Back
                    <kbd className="kbd kbd-sm">Esc</kbd>
                  </Button>
                </div>
                <div>
                  <p className="mb-1 text-[0.65rem] font-bold tracking-[0.28em] text-primary uppercase">
                    Local storage
                  </p>
                  <h2 className="font-[Futura] text-3xl">Create a vault</h2>
                  <p className="mt-1 mb-8 text-xs text-base-content/55">
                    Your notes, tasks and settings will live inside this folder.
                  </p>
                  <div className="flex items-start justify-between gap-x-10">
                    <div>
                      <div>Vault name</div>
                      <div className="text-xs font-semibold text-nowrap opacity-70">
                        Pick a name for your new vault
                      </div>
                    </div>
                    <fieldset>
                      <Input
                        className={`input ${!isValidName ? "input-error" : ""}`}
                        type="text"
                        required
                        placeholder="Vault name"
                        maxLength={60}
                        minLength={1}
                        value={newVaultName}
                        onChange={(e: any) => {
                          const value = e.target.value;
                          setNewVaultName(value);
                          const hasInvalidChars = /[/\\]/.test(value);
                          const endsWithDot = /\.$/.test(value);
                          const isValid =
                            value.length > 0 &&
                            !hasInvalidChars &&
                            !endsWithDot;
                          setIsValidName(isValid);
                        }}
                      />
                      {!isValidName && (
                        <div className="mt-0.5 text-error text-xs">
                          Enter a valid name.
                        </div>
                      )}
                    </fieldset>
                  </div>
                  <div className="divider gap-0"></div>
                  <div className="flex items-center justify-between gap-x-10">
                    <div>
                      <div>Location</div>
                      <div className="text-xs font-semibold opacity-70">
                        {selectedLocation ? (
                          <p>
                            Your new vault will be placed in:{" "}
                            <span className="text-primary">
                              {selectedLocation}
                            </span>
                          </p>
                        ) : (
                          "Pick a place to put your new vault"
                        )}
                      </div>
                    </div>
                    <Button
                      aria-keyshortcuts="B"
                      className="btn"
                      onPress={() => onBrowseLocation()}
                    >
                      Browse
                      <kbd className="kbd kbd-sm">B</kbd>
                    </Button>
                  </div>
                </div>
                <div className="text-center mt-10">
                  <Button
                    aria-keyshortcuts="Control+Enter Meta+Enter"
                    className="btn btn-primary btn-wide"
                    isDisabled={isSavingVault}
                    onPress={() => onCreateVault()}
                  >
                    Create Vault
                    <kbd className="kbd kbd-sm">Ctrl ↵</kbd>
                  </Button>
                </div>
              </section>
            )}
          </div>
        </>
      )}
      {alert && (
        <div
          role="alert"
          className="alert absolute text-xs alert-error top-10 right-3"
        >
          <span>{alert}</span>
        </div>
      )}
    </main>
  );
}
