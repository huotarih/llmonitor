import {
  Text,
  Container,
  Paper,
  Stack,
  Title,
  TextInput,
  Button,
} from "@mantine/core"
import { useForm } from "@mantine/form"
import { IconAnalyze, IconAt, IconCheck } from "@tabler/icons-react"
import { NextSeo } from "next-seo"
import { useState } from "react"
import errorHandler from "../utils/errorHandler"
import { useSessionContext } from "@supabase/auth-helpers-react"
import { notifications } from "@mantine/notifications"

export default function PasswordReset() {
  const [loading, setLoading] = useState(false)
  const { supabaseClient } = useSessionContext()

  const form = useForm({
    initialValues: {
      email: "",
    },

    validate: {
      email: (val) => (/^\S+@\S+$/.test(val) ? null : "Invalid email"),
    },
  })

  async function handlePasswordReset({ email }) {
    setLoading(true)

    const ok = await errorHandler(
      supabaseClient.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/update-password`,
      })
    )

    if (ok) {
      notifications.show({
        icon: <IconCheck size={18} />,
        color: "teal",
        title: "Email sent 💌",
        message:
          "Check your emails to verify your email. Please check your spam folder as we currently have deliverability issues.",
      })
    }

    setLoading(false)
  }

  return (
    <Container py={100} size={600}>
      <NextSeo title="Login" />
      <Stack align="center" spacing={50}>
        <Stack align="center">
          <IconAnalyze color={"#206dce"} size={60} />
          <Title order={2} weight={700} size={40} ta="center">
            Forgot password
          </Title>
        </Stack>

        <Paper radius="md" p="xl" withBorder miw={350}>
          <Text size="lg" mb="xl" weight={500}>
            Request reset link
          </Text>

          <form onSubmit={form.onSubmit(handlePasswordReset)}>
            <Stack>
              <TextInput
                icon={<IconAt size={16} />}
                label="Email"
                type="email"
                value={form.values.email}
                onChange={(event) =>
                  form.setFieldValue("email", event.currentTarget.value)
                }
                error={form.errors.email && "Invalid email"}
                placeholder="Your email"
              />

              <Button mt="md" type="submit" fullWidth loading={loading}>
                Submit
              </Button>
            </Stack>
          </form>
        </Paper>
      </Stack>
    </Container>
  )
}
