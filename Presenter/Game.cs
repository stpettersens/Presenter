#define USE_GAMEPAD
using System.Collections.Generic;
using Microsoft.Xna.Framework;
using Microsoft.Xna.Framework.Graphics;
using Microsoft.Xna.Framework.Input;
using Microsoft.Xna.Framework.Media;
using System.Diagnostics;

namespace Presenter
{
    /// <summary>
    /// This is the main type for your game
    /// </summary>
    public class Game : Microsoft.Xna.Framework.Game
    {
        private GraphicsDeviceManager graphics;
        private SpriteBatch spriteBatch;
        private VideoPlayer player;
        private List<string> videos;
        private List<Video> p_video;
        private VideoLoader loader;
        private SpriteFont statusText, authorText, menuText;
        private string statusMessage, authorMessage;
        private int selected;
        private float menuY;
        private uint frameCounter;
        private bool isSticky, drawMenu, doneFirst;
        //private GamePadState oldstate;

        public Game()
        {
            isSticky = drawMenu = doneFirst = false;
            selected = 0;
            frameCounter = 0;
            menuY = 120.0f;
            graphics = new GraphicsDeviceManager(this);
            graphics.IsFullScreen = true;
            this.IsMouseVisible = false;
            videos = new List<string>();
            p_video = new List<Video>();
            Content.RootDirectory = "Content";
            statusMessage = authorMessage = "";
            loader = new VideoLoader();
            videos = loader.LoadVideoFile("videos.xml");

#if USE_GAMEPAD
            if (!GamePad.GetState(PlayerIndex.One).IsConnected)
            {
                statusMessage = "Please connect game pad.";
            }
#endif
        }

        /// <summary>
        /// Allows the game to perform any initialization it needs to before starting to run.
        /// This is where it can query for any required services and load any non-graphic
        /// related content.  Calling base.Initialize will enumerate through any components
        /// and initialize them as well.
        /// </summary>
        protected override void Initialize()
        {
            // TODO: Add your initialization logic here
            base.Initialize();
        }

        /// <summary>
        /// LoadContent will be called once per game and is the place to load
        /// all of your content.
        /// </summary>
        protected override void LoadContent()
        {
            // Create a new SpriteBatch, which can be used to draw textures.
            spriteBatch = new SpriteBatch(GraphicsDevice);

            // Load status, author and menu fonts.
            statusText = Content.Load<SpriteFont>("statusFont");
            authorText = Content.Load<SpriteFont>("authorFont");

            // Initialize videos and video player.
            foreach (string v in videos)
            {
                p_video.Add(Content.Load<Video>(v));
            }
            player = new VideoPlayer();
            player.IsLooped = true;
            player.Play(p_video[selected]);
        }

        /// <summary>
        /// UnloadContent will be called once per game and is the place to unload
        /// all content.
        /// </summary>
        protected override void UnloadContent()
        {
            // TODO: Unload any non ContentManager content here
        }

        /// <summary>
        /// Allows the game to run logic such as updating the world,
        /// checking for collisions, gathering input, and playing audio.
        /// </summary>
        /// <param name="gameTime">Provides a snapshot of timing values.</param>
        protected override void Update(GameTime gameTime)
        {

#if USE_GAMEPAD
            GamePadState cs = GamePad.GetState(PlayerIndex.One);
#else
            KeyboardState cs = Keyboard.GetState();
#endif

            //Debug.WriteLine(frameCounter);

            if (frameCounter % 180 == 0 && !statusMessage.Contains("Please") && !isSticky)
            {
                statusMessage = "";
                authorMessage = "";
            }

            // Allows the game to exit.
            if (cs.Buttons.Back == ButtonState.Pressed)
            {
                player.Stop(); // Stop any video playing before exiting.
                this.Exit();
            }

            // Pause.
            if (cs.Buttons.X == ButtonState.Pressed)
            {
                player.Pause();
                if (!isSticky)
                {
                    statusMessage = "Paused";
                    authorMessage = "";
                }
            }

            // Resume.
            if (cs.Buttons.A == ButtonState.Pressed)
            {
                /*if (player.State.ToString().Equals("Paused") && oldstate != cs)
                {*/         
                player.Resume();
                if (!isSticky)
                {
                    statusMessage = "Playing";
                    authorMessage = "";
                }
                /*}
                else if (player.State.ToString().Equals("Playing") && oldstate != cs)
                {
                    player.Pause();
                    statusMessage = "Paused";
                }
                oldstate = cs;*/
            }

            // Decrease volume.
            if (cs.Buttons.LeftShoulder == ButtonState.Pressed)
            {
                if (player.Volume > 0.1f) player.Volume -= 0.005f;
                if (!isSticky)
                {
                    statusMessage = "Volume -";
                    authorMessage = "";
                }
            }

            // Increase volume.
            if (cs.Buttons.RightShoulder == ButtonState.Pressed)
            {
                if (player.Volume < 1.0f) player.Volume += 0.005f;
                if (!isSticky)
                {
                    statusMessage = "Volume +";
                    authorMessage = "";
                }
            }

            // Display current video information (3 second display).
            if (cs.Buttons.Y == ButtonState.Pressed)
            {
                statusMessage = loader.GetTitle(selected);
                authorMessage = loader.GetAuthor(selected);
                isSticky = false;
            }

            // Display current video information (sticky).
            if(cs.Buttons.RightStick == ButtonState.Pressed)
            {
                statusMessage = loader.GetTitle(selected);
                authorMessage = loader.GetAuthor(selected);
                isSticky = true;
            }

            // Remove sticky video information.
            if (cs.Buttons.LeftStick == ButtonState.Pressed)
            {
                isSticky = false;
            }

            // Display video selection menu.
            /*if (cs.Buttons.B == ButtonState.Pressed)
            {
                drawMenu = true;
            }*/

            /*Debug.WriteLine("Y " + cs.ThumbSticks.Left.Y);
            Debug.WriteLine("Index " + selected);
            Debug.WriteLine("Len " + loader.Length);*/

            // Scroll up videos.
            if (cs.ThumbSticks.Left.Y > 0.0f)
            {
                if (selected < loader.Length - 1)
                {
                    selected++;
                    player.Play(p_video[selected]);
                    statusMessage = loader.GetTitle(selected);
                    authorMessage = loader.GetAuthor(selected);
                }
                else
                {
                    selected = 0;
                    player.Play(p_video[selected]);
                    statusMessage = loader.GetTitle(selected);
                    authorMessage = loader.GetAuthor(selected);
                }
                
            }

            // Scroll down videos.
            /*if (cs.ThumbSticks.Left.Y < 0.0f)
            {
                if (selected > -1) player.Play(p_video[selected--]);
            }
            
            if (frameCounter == 80000) frameCounter = 0;*/
            frameCounter++;
            base.Update(gameTime);
        }

        /// <summary>
        /// This is called when the game should draw itself.
        /// </summary>
        /// <param name="gameTime">Provides a snapshot of timing values.</param>
        protected override void Draw(GameTime gameTime)
        {
            GraphicsDevice.Clear(Color.Black);
            Texture2D videoTexture = player.GetTexture(); // Get frame texture from video player.
            Rectangle rect = GraphicsDevice.Viewport.Bounds; // Draw across the whole screen.
            spriteBatch.Begin(); // Begin the sprite batch.
            spriteBatch.Draw(videoTexture, rect, Color.White); // Draw the frame.
            spriteBatch.DrawString(statusText, statusMessage, new Vector2(50.0f, 20.0f), Color.White);
            spriteBatch.DrawString(authorText, authorMessage, new Vector2(50.0f, 45.0f), Color.White);
            if (drawMenu)
            {
                for (int i = 0; i < loader.Length; i++)
                {
                    if (i == 0) menuY = 120.0f;
                    else if (i == 1) menuY = 140.0f;
                    else if (i == 2) menuY = 160.0f;
                    else if (i == 3) menuY = 180.0f;
                    else if (i == 4) menuY = 200.0f;
                    else if (i == 5) menuY = 220.0f;
                    else if (i == 6) menuY = 240.0f;
                    else if (i == 7) menuY = 260.0f;
                    spriteBatch.DrawString(statusText, loader.GetTitle(i), new Vector2(20.0f, menuY), Color.White);  
                }
            }
            spriteBatch.End(); // End the sprite batch.
            base.Draw(gameTime);
        }
    }
}
